import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import OpenAI from "openai";
import { RECIPE_THUMBNAIL_PROMPT } from "./image-gen-prompts";
import dotenv from "dotenv";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { eq, isNull, like } from "drizzle-orm";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";

import { recipesTable } from "@db/schema/schema";
import { Recipe } from "@db/schema/types";

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize database connection
const parentDir = join(__dirname, "..");
const sqlite = new Database(join(parentDir, "assets/recipes.db"));
const db = drizzle(sqlite);

// Define the directory for storing recipe thumbnails
const THUMBNAILS_DIR = join(parentDir, "./thumbnails");

async function generateAndSaveImage(recipe: Recipe): Promise<string> {
  try {
    // Generate image using OpenAI
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${RECIPE_THUMBNAIL_PROMPT} The dish is: ${recipe.ingredients + "\n" + recipe.instructions}`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    // Generate UUID for the image
    const imageId = uuidv4();
    const fileName = `${imageId}.jpg`;
    const filePath = join(THUMBNAILS_DIR, fileName);

    // Ensure the thumbnails directory exists
    if (!existsSync(THUMBNAILS_DIR)) {
      await mkdir(THUMBNAILS_DIR, { recursive: true });
    }

    // Write the image to disk
    await writeFile(filePath, Buffer.from(imageBuffer));

    // Update the database with the new thumbnail path
    await db
      .update(recipesTable)
      .set({ thumbnail: fileName })
      .where(eq(recipesTable.id, recipe.id));

    // Return the relative path to the image
    return `assets/recipe-thumbnails/${fileName}`;
  } catch (error) {
    console.error(`Error generating/saving image for ${recipe.title}:`, error);
    throw error;
  }
}

async function processRecipes() {
  try {
    // Find all recipes without thumbnails
    const recipes = await db
      .select()
      .from(recipesTable)
      .where(like(recipesTable.thumbnail, "%default%"));

    console.log(`Found ${recipes.length} recipes without thumbnails`);

    for (const recipe of recipes) {
      try {
        console.log(`Processing recipe: ${recipe.title}`);
        const thumbnailPath = await generateAndSaveImage(recipe);

        // Update the database with the new thumbnail path
        await db
          .update(recipesTable)
          .set({ thumbnail: thumbnailPath })
          .where(eq(recipesTable.id, recipe.id));

        console.log(`✅ Successfully processed`);

        // Add a small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to process recipe:`, error);
        // Continue with next recipe even if one fails
        continue;
      }
    }
  } catch (error) {
    console.error("Error processing recipes:", error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run the script
processRecipes()
  .then(() => {
    console.log("Finished processing all recipes");
  })
  .catch((error) => {
    console.error("Error processing recipes:", error);
    process.exit(1);
  });
