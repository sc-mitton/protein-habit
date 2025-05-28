import { join, dirname } from "path";
import { writeFile, unlink } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import sharp from "sharp";
import axios from "axios";
import readline from "readline";

// Promisify exec
const execAsync = promisify(exec);

// Define the directory for storing recipe thumbnails
export const THUMBNAILS_DIR = dirname(__filename);

// S3 bucket configuration
const BUCKET_REGION = "us-west-1";
const S3_BUCKET_NAME = "protein-habit-recipe-thumbs";

// Initialize S3 client
const s3Client = new S3Client({
  region: BUCKET_REGION,
  credentials: fromIni({ profile: "protein-habit" }),
});

// Initialize UserAPI client
export const userApiClient = axios.create({
  baseURL: "https://api.userapi.ai/",
  headers: {
    "Api-Key": process.env.USERAPI_API_KEY,
    "Content-Type": "application/json",
  },
});

/**
 * Trims a prompt to a maximum length
 */
export function trimPrompt(prompt: string, maxLength: number = 2000): string {
  if (prompt.length <= maxLength) {
    return prompt;
  }

  console.log(
    `\n⚠️ Prompt exceeds maximum length of ${maxLength} characters. Trimming...`,
  );
  console.log(`Original length: ${prompt.length} characters`);

  // Trim the prompt to the maximum length
  const trimmedPrompt = prompt.substring(0, maxLength);

  console.log(`Trimmed length: ${trimmedPrompt.length} characters`);
  return trimmedPrompt;
}

/**
 * Waits for a file to be deleted (used to wait for webhook processing)
 */
export async function waitForFileDeletion(
  filePath: string,
  maxWaitTimeMs = 300000,
): Promise<void> {
  const startTime = Date.now();
  const checkInterval = 5000; // Check every 5 seconds

  console.log(`\nWaiting for file to be processed: ${filePath}`);

  while (existsSync(filePath)) {
    // Check if we've exceeded the maximum wait time
    if (Date.now() - startTime > maxWaitTimeMs) {
      throw new Error(`Timeout waiting for file to be processed: ${filePath}`);
    }

    // Wait for the check interval
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }

  console.log(`\n✅ File has been processed: ${filePath}`);
}

/**
 * Crops the selected image from the grid
 */
export async function cropSelectedImage(
  imagePath: string,
  selectedImage: number,
): Promise<string> {
  try {
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Could not get image dimensions");
    }

    // Calculate dimensions for each quadrant
    const halfWidth = Math.floor(metadata.width / 2);
    const halfHeight = Math.floor(metadata.height / 2);

    // Calculate crop coordinates based on selected image (1-4)
    let left = 0;
    let top = 0;

    switch (selectedImage) {
      case 1: // Top-left
        left = 0;
        top = 0;
        break;
      case 2: // Top-right
        left = halfWidth;
        top = 0;
        break;
      case 3: // Bottom-left
        left = 0;
        top = halfHeight;
        break;
      case 4: // Bottom-right
        left = halfWidth;
        top = halfHeight;
        break;
      default:
        throw new Error(`Invalid image selection: ${selectedImage}`);
    }

    // Create a new filename for the cropped image
    const originalPath = imagePath;
    const croppedPath = originalPath.replace(".png", `_${selectedImage}.png`);

    // Crop the image
    await sharp(imagePath)
      .extract({ left, top, width: halfWidth, height: halfHeight })
      .toFile(croppedPath);

    console.log(
      `\n✅ Successfully cropped image ${selectedImage} to ${croppedPath}`,
    );

    return croppedPath;
  } catch (error) {
    console.error(`\n❌ Error cropping image:`, error);
    throw error;
  }
}

/**
 * Resizes an image to 644x644
 */
export async function resizeImage(imagePath: string): Promise<void> {
  try {
    // Create a temporary file path
    const tempPath = imagePath.replace(".png", "_temp.png");

    // Resize the image to 644x644
    await sharp(imagePath)
      .resize(644, 644, {
        fit: "cover",
        position: "center",
      })
      .toFile(tempPath);

    // Replace the original image with the resized one
    await unlink(imagePath);
    await writeFile(imagePath, readFileSync(tempPath));
    await unlink(tempPath);

    console.log(`\n✅ Successfully resized image to 644x644`);
  } catch (error) {
    console.error(`\n❌ Error resizing image:`, error);
    throw error;
  }
}

/**
 * Handles image selection from the grid
 */
export async function selectImageFromGrid(imagePath: string): Promise<void> {
  // Automatically select image number 1 (top-left)
  const selectedImage = 1;
  console.log(`\nAutomatically selecting image ${selectedImage} (top-left)`);

  let croppedPath: string | null = null;

  try {
    // Crop the selected image
    croppedPath = await cropSelectedImage(imagePath, selectedImage);

    // Replace the original image with the cropped one
    await unlink(imagePath);
    await writeFile(imagePath, readFileSync(croppedPath));

    // Resize the image to 644x644
    await resizeImage(imagePath);

    console.log(
      `\n✅ Selected image ${selectedImage} and replaced the original`,
    );
  } catch (error) {
    console.error("\n❌ Error selecting image:", error);
  } finally {
    // Always clean up the cropped temporary file
    if (croppedPath && existsSync(croppedPath)) {
      try {
        await unlink(croppedPath);
        console.log(`\n✅ Cleaned up temporary cropped file: ${croppedPath}`);
      } catch (cleanupError) {
        console.error(
          `\n❌ Error cleaning up temporary file: ${croppedPath}`,
          cleanupError,
        );
      }
    }
  }
}

/**
 * Prompts user for next action
 */
export async function promptUserForNextAction(
  imageHash: string,
): Promise<boolean> {
  const imagePath = join(THUMBNAILS_DIR, `${imageHash}.png`);

  if (!existsSync(imagePath)) {
    console.log("\nImage file not found. Continuing to next recipe.");
    return true;
  }

  console.log("\nAutomatically continuing to next recipe...");
  return true;
}

/**
 * Uploads an image to S3
 */
export async function uploadToS3(filePath: string, key: string): Promise<void> {
  try {
    const fileContent = readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: "image/png",
    });

    await s3Client.send(command);
    console.log(`\n✅ Successfully uploaded image to S3: ${key}`);
  } catch (error) {
    console.error(`\n❌ Error uploading to S3:`, error);
    throw error;
  }
}

/**
 * Opens an image with the default preview application
 */
export async function openImageWithPreview(imagePath: string): Promise<void> {
  try {
    await execAsync(`open ${imagePath}`);
    console.log("\n✅ Image opened with preview.");
  } catch (error) {
    console.error("\n❌ Error opening image:", error);
  }
}
