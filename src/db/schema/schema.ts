import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { CuisineEnum, MealTypeEnum, ProteinEnum, DishTypeEnum } from "./enums";

/* --------------------------------- Tables --------------------------------- */

export const recipesTable = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").notNull(),
  instructions: text("instructions").notNull(),
  thumbnail: text("thumbnail").notNull(),
  seen: integer("seen", { mode: "boolean" }).notNull().default(false),
});

export const cuisinesTable = sqliteTable("cuisines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", {
    enum: Object.values(CuisineEnum) as [string, ...string[]],
  })
    .notNull()
    .unique(),
});

export const mealTypesTable = sqliteTable("meal_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", {
    enum: Object.values(MealTypeEnum) as [string, ...string[]],
  })
    .notNull()
    .unique(),
});

export const proteinTypesTable = sqliteTable("proteins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", {
    enum: Object.values(ProteinEnum) as [string, ...string[]],
  })
    .notNull()
    .unique(),
});

export const dishTypesTable = sqliteTable("dish_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", {
    enum: Object.values(DishTypeEnum) as [string, ...string[]],
  })
    .notNull()
    .unique(),
});

/* ------------------------ Nutrition Meta Data Table ----------------------- */

export const servingsTable = sqliteTable("servings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id")
    .notNull()
    .unique()
    .references(() => recipesTable.id),
  size: real("size").notNull(),
  sizeUnit: text("size_unit").notNull(),
  proteinPerServing: real("protein_per_serving").notNull(),
  caloriesPerServing: real("calories_per_serving").notNull(),
});

/* ----------------------------- Through Tables ----------------------------- */

export const recipesToCuisines = sqliteTable("recipe_cuisine_association", {
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipesTable.id),
  cuisineId: integer("cuisine_id")
    .notNull()
    .references(() => cuisinesTable.id),
});

export const recipesToMealTypes = sqliteTable("recipe_meal_type_association", {
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipesTable.id),
  mealTypeId: integer("meal_type_id")
    .notNull()
    .references(() => mealTypesTable.id),
});

export const recipesToProteins = sqliteTable("recipe_protein_association", {
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipesTable.id),
  proteinId: integer("protein_id")
    .notNull()
    .references(() => proteinTypesTable.id),
});

export const recipesToDishTypes = sqliteTable("recipe_dish_type_association", {
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipesTable.id),
  dishTypeId: integer("dish_type_id")
    .notNull()
    .references(() => dishTypesTable.id),
});

/* -------------------------------- Relations ------------------------------- */

export const recipesRelations = relations(recipesTable, ({ many, one }) => ({
  recipeCuisines: many(recipesToCuisines),
  recipeMealTypes: many(recipesToMealTypes),
  recipeProteins: many(recipesToProteins),
  recipeDishTypes: many(recipesToDishTypes),
  serving: one(servingsTable),
}));

export const recipesCuisinesRelations = relations(
  recipesToCuisines,
  ({ one }) => ({
    recipe: one(recipesTable, {
      fields: [recipesToCuisines.recipeId],
      references: [recipesTable.id],
    }),
    cuisine: one(cuisinesTable, {
      fields: [recipesToCuisines.cuisineId],
      references: [cuisinesTable.id],
    }),
  }),
);

export const recipeMealTypesRelations = relations(
  recipesToMealTypes,
  ({ one }) => ({
    recipe: one(recipesTable, {
      fields: [recipesToMealTypes.recipeId],
      references: [recipesTable.id],
    }),
    mealType: one(mealTypesTable, {
      fields: [recipesToMealTypes.mealTypeId],
      references: [mealTypesTable.id],
    }),
  }),
);

export const recipeProteinRelations = relations(
  recipesToProteins,
  ({ one }) => ({
    recipe: one(recipesTable, {
      fields: [recipesToProteins.recipeId],
      references: [recipesTable.id],
    }),
    protein: one(proteinTypesTable, {
      fields: [recipesToProteins.proteinId],
      references: [proteinTypesTable.id],
    }),
  }),
);

export const recipeDishTypesRelations = relations(
  recipesToDishTypes,
  ({ one }) => ({
    recipe: one(recipesTable, {
      fields: [recipesToDishTypes.recipeId],
      references: [recipesTable.id],
    }),
    dishType: one(dishTypesTable, {
      fields: [recipesToDishTypes.dishTypeId],
      references: [dishTypesTable.id],
    }),
  }),
);

export const cuisineRelations = relations(cuisinesTable, ({ many }) => ({
  recipes: many(recipesToCuisines),
}));

export const mealTypeRelations = relations(mealTypesTable, ({ many }) => ({
  recipes: many(recipesToMealTypes),
}));

export const proteinsRelations = relations(proteinTypesTable, ({ many }) => ({
  recipes: many(recipesToProteins),
}));

export const dishTypeRelations = relations(dishTypesTable, ({ many }) => ({
  recipes: many(recipesToDishTypes),
}));

export const servingRelations = relations(servingsTable, ({ one }) => ({
  recipe: one(recipesTable, {
    fields: [servingsTable.recipeId],
    references: [recipesTable.id],
  }),
}));
