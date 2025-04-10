import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { join } from "path";
import {
  recipesTable,
  cuisinesTable,
  mealTypesTable,
  proteinTypesTable,
  dishTypesTable,
  recipesToCuisines,
  recipesToMealTypes,
  recipesToProteins,
  recipesToDishTypes,
  metaTable,
} from "@db/schema/schema";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { eq } from "drizzle-orm";
import { OpenAI } from "openai";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { prompt, role } from "./recipe-gen-promps";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize database connection
const parentDir = join(__dirname, "..");
const sqlite = new Database(join(parentDir, "assets/recipes.db"));
const dishesPath = join(parentDir, "scripts/dishes.csv");
// const dishesSlicesPath = join(parentDir, "scripts/dishes-slice.csv");
const db = drizzle(sqlite);

// Define interfaces based on the CSV data
export type Dish = {
  name: string;
  ingredients?: string;
  instructions?: string;
  cuisine?: string;
  meal?: string;
  protein?: string;
  dish?: string;
  link?: string;
};

interface GeneratedRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  meal: string;
  protein: string;
  dish: string;
  number_of_servings: number;
  protein_per_serving: number;
  prep_time: number | string;
  cook_time: number | string;
}

interface SectionObject {
  section_title: string;
  items: string[];
}

function readDishesCsv(path: string): Dish[] {
  const fileContent = readFileSync(path, "utf-8");
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

function convertToMarkdown(
  data: string[] | Record<string, string[]> | SectionObject[],
): string {
  if (Array.isArray(data)) {
    // Check if it's an array of section objects
    if (
      data.length > 0 &&
      typeof data[0] === "object" &&
      "section_title" in data[0] &&
      "items" in data[0]
    ) {
      return (data as SectionObject[])
        .map((section) => {
          return `## ${section.section_title}\n${section.items.map((item) => `- ${item}`).join("\n")}`;
        })
        .join("\n\n");
    }
    // Simple array of strings
    return (data as string[]).map((item) => `- ${item}`).join("\n");
  } else if (typeof data === "object" && data !== null) {
    // Handle Record<string, string[]> format
    return Object.entries(data as Record<string, string[]>)
      .map(([section, items]) => {
        if (Array.isArray(items)) {
          return `## ${section.charAt(0).toUpperCase() + section.slice(1)}\n${items.map((item) => `- ${item}`).join("\n")}`;
        } else if (typeof items === "object" && items !== null) {
          return `## ${section.charAt(0).toUpperCase() + section.slice(1)}\n${convertToMarkdown(items)}`;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return "";
}

async function storeRecipeInDb(recipe: GeneratedRecipe): Promise<void> {
  // Convert prep_time string to minutes
  const prepTimeInMinutes =
    typeof recipe.prep_time === "string"
      ? convertPrepTimeToMinutes(recipe.prep_time)
      : recipe.prep_time;
  const cookTimeInMinutes =
    typeof recipe.cook_time === "string"
      ? convertPrepTimeToMinutes(recipe.cook_time)
      : recipe.cook_time;

  // Convert ingredients and instructions to markdown
  const ingredientsMarkdown = convertToMarkdown(recipe.ingredients);
  const instructionsMarkdown = convertToMarkdown(recipe.instructions);

  const [insertedRecipe] = await db
    .insert(recipesTable)
    .values({
      title: recipe.name,
      ingredients: ingredientsMarkdown,
      instructions: instructionsMarkdown,
      thumbnail: "default_thumbnail.jpg",
    })
    .returning();

  // Insert the serving information
  await db.insert(metaTable).values({
    recipeId: insertedRecipe.id,
    numberOfServings: recipe.number_of_servings,
    proteinPerServing: recipe.protein_per_serving,
    prepTime: prepTimeInMinutes,
    cookTime: cookTimeInMinutes,
  });

  // Insert associations if available
  if (recipe.cuisine) {
    const cuisineName = recipe.cuisine.toLowerCase();
    const [cuisine] = await db
      .select({ id: cuisinesTable.id })
      .from(cuisinesTable)
      .where(eq(cuisinesTable.name, cuisineName));

    if (cuisine) {
      await db.insert(recipesToCuisines).values({
        recipeId: insertedRecipe.id,
        cuisineId: cuisine.id,
      });
    }
  }

  if (recipe.meal) {
    const mealName = recipe.meal.toLowerCase();
    const [mealType] = await db
      .select({ id: mealTypesTable.id })
      .from(mealTypesTable)
      .where(eq(mealTypesTable.name, mealName));

    if (mealType) {
      await db.insert(recipesToMealTypes).values({
        recipeId: insertedRecipe.id,
        mealTypeId: mealType.id,
      });
    }
  }

  if (recipe.protein) {
    const proteinName = recipe.protein.toLowerCase();
    const [protein] = await db
      .select({ id: proteinTypesTable.id })
      .from(proteinTypesTable)
      .where(eq(proteinTypesTable.name, proteinName));

    if (protein) {
      await db.insert(recipesToProteins).values({
        recipeId: insertedRecipe.id,
        proteinId: protein.id,
      });
    }
  }

  if (recipe.dish) {
    const dishName = recipe.dish.toLowerCase();
    const [dishType] = await db
      .select({ id: dishTypesTable.id })
      .from(dishTypesTable)
      .where(eq(dishTypesTable.name, dishName));

    if (dishType) {
      await db.insert(recipesToDishTypes).values({
        recipeId: insertedRecipe.id,
        dishTypeId: dishType.id,
      });
    }
  }
}

function convertPrepTimeToMinutes(prepTime: string): number {
  // Default to 30 minutes if we can't parse the time
  if (!prepTime) return 30;

  const hoursMatch = prepTime.match(/(\d+)\s*hour/i);
  const minutesMatch = prepTime.match(/(\d+)\s*min/i);

  let totalMinutes = 0;

  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1]) * 60;
  }

  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1]);
  }

  return totalMinutes || 30; // Default to 30 minutes if parsing fails
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

async function processDish(dish: Dish) {
  const openAIPrompt = `${role}\n${prompt(dish)}`;

  let recipeText = "";
  const format = {
    text: {
      format: {
        type: "json_schema",
        name: "recipe",
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            ingredients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section_title: { type: "string" },
                  items: { type: "array", items: { type: "string" } },
                },
                required: ["section_title", "items"],
                additionalProperties: false,
              },
            },
            instructions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section_title: { type: "string" },
                  items: { type: "array", items: { type: "string" } },
                },
                required: ["section_title", "items"],
                additionalProperties: false,
              },
            },
            number_of_servings: { type: "number" },
            protein_per_serving: { type: "number" },
            prep_time: { type: "number" },
            cook_time: { type: "number" },
          },
          required: [
            "name",
            "ingredients",
            "instructions",
            "number_of_servings",
            "protein_per_serving",
            "prep_time",
            "cook_time",
          ],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  } as const;

  if (dish.ingredients || dish.instructions) {
    const response = await openai.responses.create({
      model: "gpt-4o",
      tools: [
        {
          type: "web_search_preview",
          search_context_size: "medium",
        },
      ],
      input: openAIPrompt,
      ...format,
    });
    recipeText = response.output_text;
  } else {
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: openAIPrompt,
      tools: [{ type: "web_search_preview" }],
      ...format,
    });
    recipeText = response.output_text;
  }

  const recipeJson = JSON.parse(recipeText) as GeneratedRecipe;
  await storeRecipeInDb(recipeJson);
}

async function main() {
  // Apply migrations first
  await applyMigrations();

  // Read dishes from CSV
  const dishes = readDishesCsv(dishesPath);
  console.log(`Found ${dishes.length} dishes in CSV`);

  // Process each dish
  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    console.log(`Processing dish ${i + 1}/${dishes.length}: ${dish.name}`);
    try {
      await processDish(dish);
    } catch (error) {
      console.error(`❌ Error processing dish`, error);
      continue;
    }
    console.log(`✅ Successfully processed`);
  }
  sqlite.close();
}

main().catch(console.error);
