import { useEffect, useState } from "react";
import { eq, inArray } from "drizzle-orm";
import { recipesTable } from "@db/schema/schema";
import { useDrizzleDb } from "./useDrizzleDb";
import type { RecipeWithAssociations } from "@db/schema/types";

type RecipeId = string;
type RecipeIds = RecipeId | RecipeId[];

type SingleRecipeResult = {
  recipe: RecipeWithAssociations | null;
  isLoading: boolean;
  error: Error | null;
};

type MultipleRecipesResult = {
  recipes: RecipeWithAssociations[];
  isLoading: boolean;
  error: Error | null;
};

type UseSelectRecipeResult<T extends RecipeIds> = T extends RecipeId
  ? SingleRecipeResult
  : MultipleRecipesResult;

export function useSelectRecipe<T extends RecipeIds>(
  id?: T,
): UseSelectRecipeResult<T> {
  const [recipes, setRecipes] = useState<RecipeWithAssociations[]>([]);
  const [recipe, setRecipe] = useState<RecipeWithAssociations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { db } = useDrizzleDb();
  const [recipeIds, setRecipeIds] = useState<RecipeIds>("");

  useEffect(() => {
    async function fetchRecipes(ids: RecipeIds) {
      try {
        setIsLoading(true);

        if (Array.isArray(ids)) {
          // Fetch multiple recipes
          const queryResult = await db.query.recipesTable.findMany({
            where: inArray(recipesTable.id, ids),
            with: {
              recipeCuisines: {
                with: {
                  cuisine: true,
                },
              },
              recipeMealTypes: {
                with: {
                  mealType: true,
                },
              },
              recipeProteins: {
                with: {
                  protein: true,
                },
              },
              recipeDishTypes: {
                with: {
                  dishType: true,
                },
              },
              meta: true,
            },
          });

          const flattenedRecipes = queryResult.map((result) => {
            if (!result.meta) {
              throw new Error(
                `Recipe with ID ${result.id} not found or missing meta data`,
              );
            }

            return {
              ...result,
              cuisines: result.recipeCuisines.map((rc) => rc.cuisine),
              mealTypes: result.recipeMealTypes.map((rm) => rm.mealType),
              proteins: result.recipeProteins.map((rp) => rp.protein),
              dishTypes: result.recipeDishTypes.map((rd) => rd.dishType),
              meta: result.meta,
            };
          });

          setRecipes(flattenedRecipes);
        } else {
          // Fetch a single recipe
          const queryResult = await db.query.recipesTable.findFirst({
            where: eq(recipesTable.id, ids),
            with: {
              recipeCuisines: {
                with: {
                  cuisine: true,
                },
              },
              recipeMealTypes: {
                with: {
                  mealType: true,
                },
              },
              recipeProteins: {
                with: {
                  protein: true,
                },
              },
              recipeDishTypes: {
                with: {
                  dishType: true,
                },
              },
              meta: true,
            },
          });

          if (!queryResult || !queryResult.meta) {
            throw new Error("Recipe not found");
          }

          const flattenedRecipe: RecipeWithAssociations = {
            ...queryResult,
            cuisines: queryResult.recipeCuisines.map((rc) => rc.cuisine),
            mealTypes: queryResult.recipeMealTypes.map((rm) => rm.mealType),
            proteins: queryResult.recipeProteins.map((rp) => rp.protein),
            dishTypes: queryResult.recipeDishTypes.map((rd) => rd.dishType),
            meta: queryResult.meta,
          };

          setRecipe(flattenedRecipe);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch recipe(s)"),
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (recipeIds) {
      fetchRecipes(recipeIds);
    }
  }, [recipeIds]);

  useEffect(() => {
    if (id !== recipeIds && id) {
      setRecipeIds(id);
    }
  }, [id]);

  // Return type based on whether a single ID or array was provided
  if (Array.isArray(id)) {
    return { recipes, isLoading, error } as UseSelectRecipeResult<T>;
  } else {
    return { recipe, isLoading, error } as UseSelectRecipeResult<T>;
  }
}
