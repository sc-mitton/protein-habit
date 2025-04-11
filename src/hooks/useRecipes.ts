import { useEffect, useRef, useState } from "react";
import { sql, eq, and, desc, gt, inArray } from "drizzle-orm";

import {
  recipesTable,
  recipesToCuisines,
  recipesToMealTypes,
  recipesToProteins,
  recipesToDishTypes,
  metaTable,
} from "@db/schema/schema";
import { useDrizzleDb } from "./useDrizzleDb";
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

    const filtersConditions = options.filters?.tags
      ? Object.entries(options.filters.tags).map(([key, value]) => {
          switch (key) {
            case "cuisine":
              return eq(recipesToCuisines.cuisine, value);
            case "mealType":
              return eq(recipesToMealTypes.mealType, value);
            case "protein":
              return eq(recipesToProteins.protein, value);
            case "dishType":
              return eq(recipesToDishTypes.dishType, value);
          }
        })
      : [];
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
          : and(...filtersConditions),
      )
      .orderBy(desc(recipesTable.lastSeen))
      .groupBy(recipesTable.id)
      .limit(pageSize);

    const mappedResults = results.map((result) => ({
      ...result.recipes,
      meta: result.meta,
    }));

    // Update cursorId to the last recipe id
    cursorId.current = mappedResults[mappedResults.length - 1].id;

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
