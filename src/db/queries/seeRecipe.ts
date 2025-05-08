import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";

import * as schema from "@db/schema/schema";
import { Recipe } from "@db/schema/types";

export async function seeRecipe(
  db: ExpoSQLiteDatabase<typeof schema>,
  recipes: Recipe[],
) {
  for (const recipe of recipes) {
    await db
      .update(schema.recipesTable)
      .set({
        seen: (recipe.seen || 0) + 1,
        order: Math.floor(Math.random() * 10e9),
      })
      .where(eq(schema.recipesTable.id, recipe.id));
  }
  return;
}
