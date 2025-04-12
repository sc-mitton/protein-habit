import { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { recipesTable } from "@db/schema/schema";
import { useDrizzleDb } from "./useDrizzleDb";
import type { RecipeWithAssociations } from "@db/schema/types";

export function useSelectRecipe(id?: string) {
  const [recipe, setRecipe] = useState<RecipeWithAssociations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { db } = useDrizzleDb();
  const [recipeId, setRecipeId] = useState<string>("");

  useEffect(() => {
    async function fetchRecipe(recipeId: string) {
      try {
        setIsLoading(true);

        const queryResult = await db.query.recipesTable.findFirst({
          where: eq(recipesTable.id, recipeId),
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
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch recipe"),
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (recipeId) {
      fetchRecipe(recipeId);
    }
  }, [recipeId]);

  useEffect(() => {
    if (id !== recipeId && id) {
      setRecipeId(id);
    }
  }, [id]);

  return { recipe, isLoading, error };
}
