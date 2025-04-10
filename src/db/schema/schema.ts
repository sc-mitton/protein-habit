import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { CuisineEnum, MealTypeEnum, ProteinEnum, DishTypeEnum } from "./enums";

/* --------------------------------- Tables --------------------------------- */

export const recipesTable = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  ingredients: text("ingredients", { mode: "json" }).notNull(),
  instructions: text("instructions", { mode: "json" }).notNull(),
  thumbnail: text("thumbnail").notNull(),
  lastSeen: text("last_seen"),
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

export const metaTable = sqliteTable("meta", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id")
    .notNull()
    .unique()
    .references(() => recipesTable.id, { onDelete: "cascade" }),
  numberOfServings: integer("number_of_servings").notNull(),
  proteinPerServing: real("protein_per_serving").notNull(),
  caloriesPerServing: real("calories_per_serving"),
  prepTime: integer("prep_time").notNull(),
  cookTime: integer("cook_time"),
});

/* ----------------------------- Through Tables ----------------------------- */

export const recipesToCuisines = sqliteTable("recipe_cuisine_association", {
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipesTable.id, { onDelete: "cascade" }),
  cuisineId: integer("cuisine_id")
    .notNull()
    .references(() => cuisinesTable.id),
});

export const recipesToMealTypes = sqliteTable("recipe_meal_type_association", {
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipesTable.id, { onDelete: "cascade" }),
  mealTypeId: integer("meal_type_id")
    .notNull()
    .references(() => mealTypesTable.id),
});

export const recipesToProteins = sqliteTable("recipe_protein_association", {
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipesTable.id, { onDelete: "cascade" }),
  proteinId: integer("protein_id")
    .notNull()
    .references(() => proteinTypesTable.id),
});

export const recipesToDishTypes = sqliteTable("recipe_dish_type_association", {
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipesTable.id, { onDelete: "cascade" }),
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
  meta: one(metaTable),
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

export const metaRelations = relations(metaTable, ({ one }) => ({
  recipe: one(recipesTable, {
    fields: [metaTable.recipeId],
    references: [recipesTable.id],
  }),
}));
