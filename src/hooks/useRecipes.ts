import { useEffect, useRef, useState } from "react";
import { sql, eq, and, desc, gt, inArray, or } from "drizzle-orm";

import {
  recipesTable,
  recipesToCuisines,
  recipesToMealTypes,
  recipesToProteins,
  recipesToDishTypes,
  metaTable,
} from "@db/schema/schema";
import { useDrizzleDb } from "@db";
import type { RecipeFts, RecipeWithMeta } from "@db/schema/types";

interface UseRecipesOptions {
  pageSize?: number;
  filters?: {
    searchQuery?: string;
    tags?: { [key: string]: string };
  };
}

export const useRecipes = (options: UseRecipesOptions = {}) => {
  const { db } = useDrizzleDb();
  const cursorId = useRef<string | null>(null);
  const endOfResults = useRef(false);
  const pageSize = options.pageSize || 10;
  const [recipes, setRecipes] = useState<RecipeWithMeta[]>([]);
  const [filters, setFilters] = useState(options.filters);

  const query = async () => {
    let searchIds: string[] = [];
    if (filters?.searchQuery) {
      const results = (await db.get(sql`
        SELECT id FROM recipes_fts
        WHERE recipes_fts MATCH '${filters.searchQuery}'
        limit ${10}
      `)) as RecipeFts[];
      searchIds = results.map((result) => result.id);
    }

    // Create a map to store conditions for each tag type
    const tagConditions: Record<string, any[]> = {
      cuisine: [],
      mealType: [],
      protein: [],
      dishType: [],
    };

    // Group conditions by tag type
    if (options.filters?.tags) {
      Object.entries(options.filters.tags).forEach(([key, value]) => {
        switch (key) {
          case "cuisine":
            tagConditions.cuisine.push(eq(recipesToCuisines.cuisine, value));
            break;
          case "meal":
            tagConditions.mealType.push(eq(recipesToMealTypes.mealType, value));
            break;
          case "protein":
            tagConditions.protein.push(eq(recipesToProteins.protein, value));
            break;
          case "dish":
            tagConditions.dishType.push(eq(recipesToDishTypes.dishType, value));
            break;
        }
      });
    }

    // Combine conditions for each tag type
    const filtersConditions: any[] = [];

    // For each tag type, if there are conditions, add them as a group
    Object.entries(tagConditions).forEach(([tagType, conditions]) => {
      if (conditions.length > 0) {
        // If there are multiple conditions for the same tag type, use OR
        // For example, if we want recipes with either "Italian" OR "Mexican" cuisine
        filtersConditions.push(or(...conditions));
      }
    });

    // Add cursor condition if needed
    if (cursorId.current) {
      filtersConditions.push(gt(recipesTable.id, cursorId.current));
    }

    const results = await db
      .select({
        recipes: recipesTable,
        meta: metaTable,
      })
      .from(recipesTable)
      .leftJoin(
        recipesToCuisines,
        eq(recipesTable.id, recipesToCuisines.recipeId),
      )
      .leftJoin(
        recipesToMealTypes,
        eq(recipesTable.id, recipesToMealTypes.recipeId),
      )
      .leftJoin(
        recipesToProteins,
        eq(recipesTable.id, recipesToProteins.recipeId),
      )
      .leftJoin(
        recipesToDishTypes,
        eq(recipesTable.id, recipesToDishTypes.recipeId),
      )
      .leftJoin(metaTable, eq(recipesTable.id, metaTable.recipeId))
      .where(
        searchIds.length > 0
          ? inArray(recipesTable.id, searchIds)
          : filtersConditions.length > 0
            ? and(...filtersConditions)
            : undefined,
      )
      .orderBy(desc(recipesTable.lastSeen))
      .groupBy(recipesTable.id)
      .limit(pageSize);

    const mappedResults = results.map((result) => ({
      ...result.recipes,
      meta: result.meta,
    }));

    // Update cursorId to the last recipe id
    if (mappedResults.length > 0) {
      cursorId.current = mappedResults[mappedResults.length - 1].id;
    }

    return mappedResults as RecipeWithMeta[];
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
  }, [filters]);

  useEffect(() => {
    // Deep compare options.filters and filters
    // and if they are different, start over from the first page
    if (JSON.stringify(options.filters) !== JSON.stringify(filters)) {
      setFilters(options.filters);
      cursorId.current = null;
      endOfResults.current = false;
      setRecipes([]);
    }
  }, [options.filters]);

  return { fetchMore: fetch, recipes };
};
