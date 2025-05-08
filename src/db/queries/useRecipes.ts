import { useEffect, useRef, useState } from "react";
import { sql, eq, and, desc, gt, inArray, or, asc, SQL } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

import {
  recipesTable,
  recipesToCuisines,
  recipesToMealTypes,
  recipesToProteins,
  recipesToDishTypes,
  metaTable,
} from "@db/schema/schema";
import { useDrizzleDb } from "@db";
import type { RecipeWithMeta } from "@db/schema/types";
import * as schema from "@db/schema/schema";
interface UseRecipesOptions {
  pageSize?: number;
  filters?: {
    searchQuery?: string;
    tags?: { [key: string]: string };
  };
}

async function getSearchIds(
  db: ExpoSQLiteDatabase<typeof schema>,
  queryString: string,
  limit = 10,
) {
  try {
    const results = (await db.all(
      sql`SELECT id FROM recipes_fts WHERE title MATCH ${queryString} LIMIT ${limit};`,
    )) as { id: string }[];

    return [
      inArray(
        recipesTable.id,
        results.map((result) => result.id),
      ),
    ];
  } catch (error) {
    console.error("error: ", error);
    return [];
  }
}

function getTagConditions(filters: UseRecipesOptions["filters"]) {
  return Object.entries(filters?.tags || {}).map(([key, value]) => {
    switch (key) {
      case "cuisine":
        return eq(recipesToCuisines.cuisine, value);
      case "meal":
        return eq(recipesToMealTypes.mealType, value);
      case "protein":
        return eq(recipesToProteins.protein, value);
      case "dish":
        return eq(recipesToDishTypes.dishType, value);
      default:
        return sql`1=1`;
    }
  });
}

export const useRecipes = (options: UseRecipesOptions = {}) => {
  const db = useDrizzleDb();
  const cursorId = useRef<string | null>(null);
  const endOfResults = useRef(false);
  const pageSize = options.pageSize || 10;
  const [recipes, setRecipes] = useState<RecipeWithMeta[]>([]);
  const [filters, setFilters] = useState(options.filters);
  const [searchQuery, setSearchQuery] = useState(options.filters?.searchQuery);

  const query = async () => {
    const whereConditions = searchQuery
      ? await getSearchIds(db, searchQuery)
      : getTagConditions(filters);

    if (cursorId.current) {
      whereConditions.push(gt(recipesTable.id, cursorId.current));
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
      .where(and(...whereConditions))
      .groupBy(recipesTable.id)
      .orderBy(asc(recipesTable.seen), asc(recipesTable.order))
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

  const refetch = async () => {
    cursorId.current = null;
    endOfResults.current = false;
    setRecipes([]);
    await fetch();
  };

  useEffect(() => {
    fetch();
  }, [filters, searchQuery]);

  useEffect(() => {
    // Deep compare options.filters and filters
    // and if they are different, start over from the first page
    if (JSON.stringify(options.filters) !== JSON.stringify(filters)) {
      setFilters(options.filters);
      cursorId.current = null;
      endOfResults.current = false;
      setRecipes([]);
    }
  }, [options.filters?.tags]);

  useEffect(() => {
    if (!searchQuery) {
      refetch();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (options.filters?.searchQuery !== searchQuery) {
      setSearchQuery(options.filters?.searchQuery);
      cursorId.current = null;
      endOfResults.current = false;
      setRecipes([]);
    }
  }, [options.filters?.searchQuery]);

  return { fetchMore: fetch, refetch: refetch, recipes };
};
