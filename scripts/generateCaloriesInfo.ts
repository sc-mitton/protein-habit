import { join } from "path";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { OpenAI } from "openai";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { eq } from "drizzle-orm";

import { recipesTable, metaTable } from "@db/schema/schema";
import { RecipeWithMeta } from "@db/schema/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize database connection
const parentDir = join(__dirname);
const sqlite = new Database(join(parentDir, "recipes.db"));
const db = drizzle(sqlite);

async function applyMigrations() {
  console.log("Applying database migrations...");
  try {
    const migrationsFolder = join(parentDir, "src/db/migrations");
    await migrate(db, { migrationsFolder });
    console.log("Migrations applied successfully");
  } catch (error) {
    console.error("Error applying migrations:", error);
    throw error;
  }
}

async function getCaloriesForRecipe(recipe: RecipeWithMeta) {
  const prompt = `Given the following recipe, calculate the approximate calories per serving.
  Consider all ingredients and their typical calorie content.

  Recipe: ${recipe.title}
  Number of servings: ${recipe.meta.numberOfServings}
  Ingredients:
  ${recipe.ingredients}

  Guidelines for calorie estimation:
  - A typical main dish serving ranges from 300-800 calories
  - Light meals/sides typically range from 100-400 calories
  - Very calorie-dense dishes (like rich desserts or heavy pasta dishes) might reach 800-1000 calories
  - Consider portion sizes and cooking methods (e.g., fried foods have more calories than baked)
  - Account for oils, butter, and other cooking fats (typically 100-120 calories per tablespoon)

  IMPORTANT: Return ONLY a number with no text, units, or explanation. For example: "450" or "350.5"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a nutrition expert specializing in accurate calorie estimation. " +
          "Calculate calories based on ingredients and serving size. " +
          "Return ONLY a number with no text, units, or explanation. ",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.1,
    max_tokens: 10,
  });

  const caloriesText = response.choices[0].message.content?.trim();

  // Remove any non-numeric characters except decimal point
  const cleanedText = caloriesText?.replace(/[^0-9.]/g, "");
  const calories = parseFloat(cleanedText || "0");

  if (isNaN(calories) || calories <= 0) {
    throw new Error(
      `Invalid calories value: ${caloriesText}. Expected a positive number.`,
    );
  }

  // Add a sanity check for unreasonably high values
  if (calories > 1500) {
    throw new Error(
      `Unreasonably high calorie value: ${calories}. This seems incorrect for a single serving.`,
    );
  }

  return calories;
}

async function main() {
  // Apply migrations first
  await applyMigrations();

  // Get all recipes with their meta information
  const recipes = await db
    .select({
      id: recipesTable.id,
      title: recipesTable.title,
      ingredients: recipesTable.ingredients,
      meta: metaTable,
    })
    .from(recipesTable)
    .leftJoin(metaTable, eq(recipesTable.id, metaTable.recipeId));

  console.log(`Found ${recipes.length} recipes to process`);

  // Process each recipe
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    console.log(
      `Processing recipe ${i + 1}/${recipes.length}: ${recipe.title}`,
    );

    if (!recipe.meta) {
      console.log(
        `⚠️ Skipping recipe ${recipe.title} - no meta information found`,
      );
      continue;
    }

    try {
      const caloriesPerServing = await getCaloriesForRecipe(
        recipe as RecipeWithMeta,
      );

      console.log("HERE HERE HERE: ", caloriesPerServing);
      // Update the meta table with calories information
      await db
        .update(metaTable)
        .set({ caloriesPerServing })
        .where(eq(metaTable.recipeId, recipe.id));
      break;
      console.log(
        `✅ Updated calories for ${recipe.title}: ${caloriesPerServing} calories per serving`,
      );
    } catch (error) {
      console.error(`❌ Error processing recipe ${recipe.title}:`, error);
      continue;
    }
  }

  sqlite.close();
}

main().catch(console.error);
