import { useEffect, useRef, useState } from "react";
import { inArray, sql } from "drizzle-orm";

import {
  Cuisine,
  MealType,
  Protein,
  DishType,
  RecipeWithAssociations,
} from "@db/schema/types";
import { useDrizzleDb } from "./useDrizzleDb";
import type { RecipeFts } from "@db/schema/types";

interface UseRecipesOptions {
  pageSize?: number;
  filters?: {
    searchQuery?: string;
    cuisine?: Cuisine["name"];
    mealType?: MealType["name"];
    protein?: Protein["name"];
    dishType?: DishType["name"];
  };
}

export const useRecipes = (options: UseRecipesOptions = {}) => {
  const { db } = useDrizzleDb();
  const cursorId = useRef<string | null>(null);
  const endOfResults = useRef(false);
  const pageSize = options.pageSize || 10;
  const [recipes, setRecipes] = useState<RecipeWithAssociations[]>([]);

  const query = async () => {
    let searchIds: string[] = [];
    if (options.filters?.searchQuery) {
      const results = (await db.get(sql`
        SELECT id FROM recipes_fts
        WHERE recipes_fts MATCH '${options.filters.searchQuery}'
        limit ${10}
      `)) as RecipeFts[];
      searchIds = results.map((result) => result.id);
    }

    const results = await db.query.recipesTable.findMany({
      columns: {
        id: true,
        title: true,
        ingredients: true,
        instructions: true,
        thumbnail: true,
        lastSeen: true,
        createdOn: true,
      },
      with: {
        recipeCuisines: { with: { cuisine: true } },
        recipeMealTypes: { with: { mealType: true } },
        recipeProteins: { with: { protein: true } },
        recipeDishTypes: { with: { dishType: true } },
        meta: true,
      },
      orderBy: (recipe, { desc }) => [desc(recipe.lastSeen)],
      where: (recipe, { and, gt }) => {
        const conditions = [];
        if (cursorId.current) {
          conditions.push(gt(recipe.id, cursorId.current));
        }
        if (searchIds.length > 0) {
          conditions.push(inArray(recipe.id, searchIds));
        }
        return and(...conditions);
      },
      limit: pageSize,
    });

    // Update cursorId to the last recipe id
    cursorId.current = results[results.length - 1].id;

    // Flatten the joined tables into the recipe object
    return results.map((recipe) => ({
      ...recipe,
      cuisines: recipe.recipeCuisines.map((rc) => rc.cuisine),
      mealTypes: recipe.recipeMealTypes.map((rm) => rm.mealType),
      proteins: recipe.recipeProteins.map((rp) => rp.protein),
      dishTypes: recipe.recipeDishTypes.map((rd) => rd.dishType),
    })) as RecipeWithAssociations[];
  };

  const fetch = async () => {
    if (endOfResults.current) return;

    const results = await query();
    setRecipes((prev) => [...prev, ...results]);

    if (results.length < pageSize) {
      endOfResults.current = true;
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { fetchMore: fetch, recipes };
};
