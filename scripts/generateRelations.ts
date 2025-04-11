import { join } from "path";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { OpenAI } from "openai";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { eq } from "drizzle-orm";
import {
  recipesTable,
  recipesToCuisines,
  recipesToMealTypes,
  recipesToProteins,
  recipesToDishTypes,
} from "@db/schema/schema";
import { cuisines, meals, proteins, dishes } from "@db/schema/enums";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize database connection
const parentDir = join(__dirname, "..");
const sqlite = new Database(join(parentDir, "assets/recipes.db"));
const db = drizzle(sqlite);

interface RecipeTags {
  cuisines: string[];
  meals: string[];
  proteins: string[];
  dishes: string[];
}

async function applyMigrations() {
  console.log("Applying database migrations...");
  try {
    // Path to migrations folder
    const migrationsFolder = join(parentDir, "src/db/migrations");

    // Apply migrations
    await migrate(db, { migrationsFolder });
    console.log("Migrations applied successfully");
  } catch (error) {
    console.error("Error applying migrations:", error);
    throw error;
  }
}

async function getRecipeTags(recipe: string): Promise<RecipeTags> {
  const prompt = `
You are a culinary expert. Based on the following recipe, determine the appropriate tags for it.
Please categorize this recipe into the following categories using ONLY the tags listed below:

Cuisines (choose from): ${cuisines.join(", ")}
Meal Types (choose from): ${meals.join(", ")}
Proteins (choose from): ${proteins.join(", ")}
Dish Types (choose from): ${dishes.join(", ")}

Recipe: ${recipe}

IMPORTANT: You must ONLY use tags from the lists provided above. Do not add any tags that aren't in those lists.
If a recipe doesn't fit a category, leave that array empty. A recipe can have one or more tags from each category.
If a recipe doesn't really fit any of the cuisines, you could probably label it as "American" unless
it's really not American.

Return your response in the following JSON format:

{
  "cuisines": string[],
  "meals": string[],
  "proteins": string[],
  "dishes": string[]
}

Each tag must exactly match one from the lists above, including spelling and case.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a culinary expert that categorizes recipes into predefined tags. You must only use the exact tags provided in the lists.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  try {
    return JSON.parse(content) as RecipeTags;
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    console.error("Raw response:", content);
    throw error;
  }
}

async function insertRecipeTags(recipeId: string, tags: RecipeTags) {
  // Insert cuisine tags
  for (const cuisine of tags.cuisines) {
    if (cuisines.includes(cuisine as any)) {
      await db
        .insert(recipesToCuisines)
        .values({
          recipeId,
          cuisine,
        })
        .onConflictDoNothing();
    }
  }

  // Insert meal type tags
  for (const meal of tags.meals) {
    if (meals.includes(meal as any)) {
      await db
        .insert(recipesToMealTypes)
        .values({
          recipeId,
          mealType: meal,
        })
        .onConflictDoNothing();
    }
  }

  // Insert protein tags
  for (const protein of tags.proteins) {
    if (proteins.includes(protein as any)) {
      await db
        .insert(recipesToProteins)
        .values({
          recipeId,
          protein,
        })
        .onConflictDoNothing();
    }
  }

  // Insert dish type tags
  for (const dish of tags.dishes) {
    if (dishes.includes(dish as any)) {
      await db
        .insert(recipesToDishTypes)
        .values({
          recipeId,
          dishType: dish,
        })
        .onConflictDoNothing();
    }
  }
}

async function main() {
  // Apply migrations first
  await applyMigrations();

  // Fetch all recipes from the database
  const recipes = await db.select().from(recipesTable);
  console.log(`Found ${recipes.length} recipes in the database`);

  // Process each recipe
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    console.log(
      `Processing recipe ${i + 1}/${recipes.length}: ${recipe.title}`,
    );

    // Add a small delay to avoid rate limiting
    if (i > 0 && i % 5 === 0) {
      console.log("Pausing for 2 seconds to avoid rate limiting...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(`Processing recipe: ${recipe.title}`);

    try {
      const tags = await getRecipeTags(
        `Title: ${recipe.title}\nIngredients: ${recipe.ingredients}\nInstructions: ${recipe.instructions}`,
      );
      await insertRecipeTags(recipe.id, tags);
      console.log(`✅ Successfully tagged recipe`);
      console.log(`Tags:`, tags);
    } catch (error) {
      console.error(`❌ Error processing recipe`, error);
    }
  }

  console.log("Finished processing all recipes");
  sqlite.close();
}

main().catch(console.error);
