import { join } from "path";
import { RECIPE_THUMBNAIL_PROMPT } from "./image-gen-prompts";
import dotenv from "dotenv";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { eq, is, like } from "drizzle-orm";
import { writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import { readdir, stat } from "fs/promises";

import { recipesTable } from "@db/schema/schema";
import { Recipe } from "@db/schema/types";
import {
  THUMBNAILS_DIR,
  userApiClient,
  trimPrompt,
  waitForFileDeletion,
  selectImageFromGrid,
  promptUserForNextAction,
  uploadToS3,
  openImageWithPreview,
} from "./imageHelpers";

// Load environment variables
dotenv.config();

// Initialize database connection
const parentDir = join(__dirname);
const sqlite = new Database(join(parentDir, "recipes.db"));
const db = drizzle(sqlite);

/**
 * Result type for image generation
 */
type ImageGenerationResult = {
  error?: string;
  continuePrompting?: boolean;
};

/**
 * Generates an image for a recipe using Midjourney
 */
async function imagineImage(
  recipe: Recipe,
  shouldPrompt: boolean,
  isRetry: boolean = false,
): Promise<ImageGenerationResult> {
  console.log(`\n==========================================`);
  console.log(`Processing recipe: ${recipe.title}`);
  if (isRetry) {
    console.log(`Retry attempt with simplified prompt`);
  }
  console.log(`==========================================`);

  // Check if there's an error file from a previous attempt
  const errorFilePath = join(
    THUMBNAILS_DIR,
    `${recipe.thumbnail?.replace(".png", "")}.error`,
  );
  const hasErrorFile = existsSync(errorFilePath);

  // STEP 1: Generate the image with Midjourney
  // For retries, use a simpler prompt without instructions and ingredients
  const fullPrompt =
    isRetry || hasErrorFile
      ? `${RECIPE_THUMBNAIL_PROMPT} The dish is: ${recipe.title}`
      : `${RECIPE_THUMBNAIL_PROMPT} The dish is: ${recipe.title}, ${recipe.instructions + "\n" + recipe.ingredients}`;
  const trimmedPrompt = trimPrompt(fullPrompt);

  const response = await userApiClient.post("/midjourney/v2/imagine", {
    prompt: trimmedPrompt,
    webhook_url: process.env.WEBHOOK_URL,
    webhook_type: "result",
  });

  const imageHash = response.data.hash;

  // STEP 2: Create an empty file to track the image processing
  // This empty file will be deleted by the webhook after processing
  const emptyFilePath = join(THUMBNAILS_DIR, imageHash);
  await writeFile(emptyFilePath, "");

  console.log(
    `\nWaiting for image processing to complete for ${recipe.title}...`,
  );

  // STEP 3: Wait for the webhook to process the image and delete the empty file
  await waitForFileDeletion(emptyFilePath);

  const isError = existsSync(errorFilePath);
  if (isError) {
    // Clean up the error file
    await unlink(errorFilePath);
    return { error: "API Error detected" };
  }

  console.log(`\n✅ Image processing completed for ${recipe.title}`);

  // STEP 4: Handle image selection and user interaction
  const imagePath = join(THUMBNAILS_DIR, `${imageHash}.png`);
  let imageSelected = false;

  if (existsSync(imagePath)) {
    // Prompt user to select an image from the grid
    await selectImageFromGrid(imagePath);
    imageSelected = true;
  } else {
    return {
      error: "Image file not found",
    };
  }

  // STEP 5: Upload the selected image to S3
  if (imageSelected && existsSync(imagePath)) {
    console.log(`\nUploading selected image to S3...`);
    await uploadToS3(imagePath, `${imageHash}.png`);
  }

  // STEP 6: Clean up - delete the actual image file (with .png extension)
  // Note: The empty file (without extension) was already deleted by the webhook
  if (existsSync(imagePath)) {
    await unlink(imagePath);
    console.log(`\n✅ Deleted image file ${imagePath}`);
  }

  // Clean up all files
  if (existsSync(errorFilePath)) {
    await unlink(errorFilePath);
    console.log(`\n✅ Cleaned up error file ${errorFilePath}`);
  }

  // STEP 7: Update the database with the image hash only after everything is successful
  if (imageSelected) {
    await db
      .update(recipesTable)
      .set({
        thumbnail: `${imageHash}.png`,
      })
      .where(eq(recipesTable.id, recipe.id));
    console.log(`\n✅ Updated database with new thumbnail`);
  }

  // STEP 8: Prompt user for next action only if shouldPrompt is true
  let continuePrompting = true;
  if (imageSelected && shouldPrompt) {
    continuePrompting = await promptUserForNextAction(imageHash);
  }

  return { continuePrompting };
}

/**
 * Main function to process all recipes without thumbnails
 */
async function processRecipes() {
  try {
    // Check for webhook URL
    if (!process.env.WEBHOOK_URL) {
      console.error(
        "\n❌ WEBHOOK_URL not found in environment. Make sure the webhook server is running.",
      );
      return;
    }

    // Maximum number of retries per recipe
    const MAX_RETRIES = 4;

    // STEP 1: Find all recipes without thumbnails
    const recipes = await db
      .select()
      .from(recipesTable)
      .where(like(recipesTable.thumbnail, "%default%"));
    console.log(`\n==========================================`);
    console.log(`Found ${recipes.length} recipes without thumbnails`);
    console.log(`==========================================\n`);
    let shouldPrompt = true;

    // STEP 2: Process each recipe
    let i = 0;
    while (i < recipes.length) {
      const recipe = recipes[i];
      let retryCount = 0;
      let success = false;

      // Clean up all error files and files without extensions
      const files = await readdir(THUMBNAILS_DIR);
      for (const file of files) {
        const filePath = join(THUMBNAILS_DIR, file);
        const stats = await stat(filePath);

        // Skip directories
        if (stats.isDirectory()) continue;

        // Check if file ends with .error or has no extension
        if (file.endsWith(".error") || !file.includes(".")) {
          await unlink(filePath);
          console.log(`\n✅ Cleaned up file: ${file}`);
        }
      }

      // Try to process the recipe with retries
      while (!success && retryCount <= MAX_RETRIES) {
        try {
          // STEP 2a: Generate image for the recipe
          const isRetry = retryCount > 0;
          const result = await imagineImage(recipe, shouldPrompt, isRetry);

          if (result.error) {
            console.error(
              `\n❌ Failed to process recipe: ${recipe.title}, error: ${result.error}`,
            );

            // If we haven't exceeded max retries, try again
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              console.log(`Retrying (${retryCount}/${MAX_RETRIES})...`);
              console.log(`\n------------------------------------------\n`);
              // Add a small delay before retrying
              await new Promise((resolve) => setTimeout(resolve, 5000));
              continue;
            } else {
              console.log(
                `\n❌ Maximum retry attempts (${MAX_RETRIES}) exceeded for ${recipe.title}`,
              );
              console.log(`\n------------------------------------------\n`);
              break;
            }
          }

          // STEP 2b: Update the shouldPrompt flag based on user choice
          if (result.continuePrompting === false) {
            shouldPrompt = false;
            console.log(`\nContinuing to end without prompting...`);
          }
          console.log(`\n✓ Recipe processed successfully: ${recipe.title}`);
          console.log(`\n------------------------------------------\n`);
          success = true;

          // Add a small delay to avoid rate limits
          await new Promise((resolve) => setTimeout(resolve, 1000));
          i++; // Only increment if successful
        } catch (error) {
          console.error(
            `\n❌ Failed to process recipe: ${recipe.title}, error: ${error}`,
          );

          // If we haven't exceeded max retries, try again
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying (${retryCount}/${MAX_RETRIES})...`);
            console.log(`\n------------------------------------------\n`);
            // Add a small delay before retrying
            await new Promise((resolve) => setTimeout(resolve, 5000));
          } else {
            console.log(
              `\n❌ Maximum retry attempts (${MAX_RETRIES}) exceeded for ${recipe.title}`,
            );
            console.log(`\n------------------------------------------\n`);
            break;
          }
        }
      }

      // If we've exhausted all retries, move to the next recipe
      if (!success) {
        i++;
      }
    }
  } catch (error) {
    console.error("\n❌ Error processing recipes:", error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run the script
processRecipes()
  .then(() => {
    console.log("\n==========================================");
    console.log("✅ Finished processing all recipes");
    console.log("==========================================\n");
  })
  .catch((error) => {
    console.error("\n❌ Error processing recipes:", error);
    process.exit(1);
  });
