import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { CuisineEnum, MealTypeEnum, ProteinEnum, DishTypeEnum } from "./enums";

// Cuisine table
export const cuisinesTable = sqliteTable("cuisines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", {
    enum: Object.values(CuisineEnum) as [string, ...string[]],
  })
    .notNull()
    .unique(),
});

// MealType table
export const mealTypesTable = sqliteTable("meal_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", {
    enum: Object.values(MealTypeEnum) as [string, ...string[]],
  })
    .notNull()
    .unique(),
});

// Protein table
export const proteinTypesTable = sqliteTable("proteins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", {
    enum: Object.values(ProteinEnum) as [string, ...string[]],
  })
    .notNull()
    .unique(),
});

// DishType table
export const dishTypesTable = sqliteTable("dish_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", {
    enum: Object.values(DishTypeEnum) as [string, ...string[]],
  })
    .notNull()
    .unique(),
});

// Recipe table
export const recipesTable = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  description: text("description"),
  ingredients: text("ingredients"),
  instructions: text("instructions"),
  thumbnail: text("thumbnail"),
  dishTypeId: integer("dish_type_id").references(() => dishTypesTable.id),
});

// Association tables for many-to-many relationships
export const recipeCuisineAssociation = sqliteTable(
  "recipe_cuisine_association",
  {
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipesTable.id),
    cuisineId: integer("cuisine_id")
      .notNull()
      .references(() => cuisinesTable.id),
  },
);

export const recipeMealTypeAssociation = sqliteTable(
  "recipe_meal_type_association",
  {
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipesTable.id),
    mealTypeId: integer("meal_type_id")
      .notNull()
      .references(() => mealTypesTable.id),
  },
);

export const recipeProteinAssociation = sqliteTable(
  "recipe_protein_association",
  {
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipesTable.id),
    proteinId: integer("protein_id")
      .notNull()
      .references(() => proteinTypesTable.id),
  },
);

export const recipeDishTypeAssociation = sqliteTable(
  "recipe_dish_type_association",
  {
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipesTable.id),
    dishTypeId: integer("dish_type_id")
      .notNull()
      .references(() => dishTypesTable.id),
  },
);
