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
export type Cuisine = typeof cuisinesTable.$inferSelect;
export type MealType = typeof mealTypesTable.$inferSelect;
export type Protein = typeof proteinTypesTable.$inferSelect;
export type DishType = typeof dishTypesTable.$inferSelect;
export type Recipe = typeof recipesTable.$inferSelect;
export type Serving = typeof servingsTable.$inferSelect;
export type RecipeCuisineAssociation = typeof recipesToCuisines.$inferSelect;
export type RecipeMealTypeAssociation = typeof recipesToMealTypes.$inferSelect;
export type RecipeProteinAssociation = typeof recipesToProteins.$inferSelect;
export type RecipeDishTypeAssociation = typeof recipesToDishTypes.$inferSelect;

export type RecipeWithAssociations = Recipe & {
  proteins: Protein[];
  dishTypes: DishType[];
  mealTypes: MealType[];
  cuisines: Cuisine[];
  serving: Serving;
};

export type RecipeFts = Pick<
  typeof recipesTable.$inferSelect,
  "id" | "title" | "description"
>;
