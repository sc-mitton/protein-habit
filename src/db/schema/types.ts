import { InferSelectModel } from "drizzle-orm";
import {
  cuisinesTable,
  mealTypesTable,
  proteinTypesTable,
  dishTypesTable,
  recipesTable,
  recipesToCuisines,
  recipesToMealTypes,
  recipesToProteins,
  recipesToDishTypes,
  servingsTable,
} from "@db/schema/schema";

// Define types for each table (for selecting/reading)
export type Cuisine = InferSelectModel<typeof cuisinesTable>;
export type MealType = InferSelectModel<typeof mealTypesTable>;
export type Protein = InferSelectModel<typeof proteinTypesTable>;
export type DishType = InferSelectModel<typeof dishTypesTable>;
export type Recipe = InferSelectModel<typeof recipesTable>;
export type Serving = InferSelectModel<typeof servingsTable>;
export type RecipeCuisineAssociation = InferSelectModel<
  typeof recipesToCuisines
>;
export type RecipeMealTypeAssociation = InferSelectModel<
  typeof recipesToMealTypes
>;
export type RecipeProteinAssociation = InferSelectModel<
  typeof recipesToProteins
>;
export type RecipeDishTypeAssociation = InferSelectModel<
  typeof recipesToDishTypes
>;

export type RecipeWithAssociations = Recipe & {
  proteins: Protein[];
  dishTypes: DishType[];
  mealTypes: MealType[];
  cuisines: Cuisine[];
  serving: Serving;
};
