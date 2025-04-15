import { join } from "path";
import { recipesTable, metaTable } from "@db/schema/schema";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { OpenAI } from "openai";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize database connection
const parentDir = join(__dirname, "..");
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

async function getCaloriesForRecipe(recipe: {
  title: string;
  ingredients: string;
  numberOfServings: number;
}) {
  const prompt = `Given the following recipe, calculate the approximate calories per serving.
  Consider all ingredients and their typical calorie content. Return ONLY a number representing calories per serving.

  Recipe: ${recipe.title}
  Number of servings: ${recipe.numberOfServings}
  Ingredients:
  ${recipe.ingredients}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a nutrition expert. Calculate calories based on ingredients and serving size. Return only a number.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 50,
  });

  const caloriesText = response.choices[0].message.content?.trim();
  const calories = parseFloat(caloriesText || "0");

  if (isNaN(calories)) {
    throw new Error(`Failed to parse calories from response: ${caloriesText}`);
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
        `Skipping recipe ${recipe.title} - no meta information found`,
      );
      continue;
    }

    try {
      const caloriesPerServing = await getCaloriesForRecipe({
        title: recipe.title,
        ingredients: recipe.ingredients,
        numberOfServings: recipe.meta.numberOfServings,
      });

      // Update the meta table with calories information
      await db
        .update(metaTable)
        .set({ caloriesPerServing })
        .where(eq(metaTable.recipeId, recipe.id));

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
