import { useEffect, useRef, useState } from "react";

import {
  Cuisine,
  MealType,
  Protein,
  DishType,
  RecipeWithAssociations,
} from "@db/schema/types";
import { useDrizzleDb } from "./useDrizzleDb";

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
  const cursorId = useRef<number | null>(null);
  const endOfResults = useRef(false);
  const pageSize = options.pageSize || 10;
  const [recipes, setRecipes] = useState<RecipeWithAssociations[]>([]);

  const query = async () => {
    const results = await db.query.recipesTable.findMany({
      columns: {
        id: true,
        title: true,
        description: true,
        ingredients: true,
        instructions: true,
        thumbnail: true,
        seen: true,
      },
      with: {
        recipeCuisines: { with: { cuisine: true } },
        recipeMealTypes: { with: { mealType: true } },
        recipeProteins: { with: { protein: true } },
        recipeDishTypes: { with: { dishType: true } },
        serving: true,
      },
      where: (recipe, { eq, and, gt }) => {
        const conditions = [eq(recipe.seen, false)];
        if (cursorId.current) {
          conditions.push(gt(recipe.id, cursorId.current));
        }
        return and(...conditions);
      },
      limit: pageSize,
    });

    // Update cursorId to the last recipe id
    cursorId.current = recipes[recipes.length - 1].id;

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
  }, [options.filters]);

  return { fetchMore: fetch, recipes };
};
