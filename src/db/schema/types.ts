import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  cuisinesTable,
  mealTypesTable,
  proteinTypesTable,
  dishTypesTable,
  recipesTable,
  recipeCuisineAssociation,
  recipeMealTypeAssociation,
  recipeProteinAssociation,
} from "@db/schema/schema";

// Define types for each table (for selecting/reading)
export type Cuisine = InferSelectModel<typeof cuisinesTable>;
export type MealType = InferSelectModel<typeof mealTypesTable>;
export type Protein = InferSelectModel<typeof proteinTypesTable>;
export type DishType = InferSelectModel<typeof dishTypesTable>;
export type Recipe = InferSelectModel<typeof recipesTable>;
export type RecipeCuisineAssociation = InferSelectModel<
  typeof recipeCuisineAssociation
>;
export type RecipeMealTypeAssociation = InferSelectModel<
  typeof recipeMealTypeAssociation
>;
export type RecipeProteinAssociation = InferSelectModel<
  typeof recipeProteinAssociation
>;

// Define types for inserting new records (without auto-generated fields)
export type NewCuisine = InferInsertModel<typeof cuisinesTable>;
export type NewMealType = InferInsertModel<typeof mealTypesTable>;
export type NewProtein = InferInsertModel<typeof proteinTypesTable>;
export type NewDishType = InferInsertModel<typeof dishTypesTable>;
export type NewRecipe = InferInsertModel<typeof recipesTable>;
export type NewRecipeCuisineAssociation = InferInsertModel<
  typeof recipeCuisineAssociation
>;
export type NewRecipeMealTypeAssociation = InferInsertModel<
  typeof recipeMealTypeAssociation
>;
export type NewRecipeProteinAssociation = InferInsertModel<
  typeof recipeProteinAssociation
>;
