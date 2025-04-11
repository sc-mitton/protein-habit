import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { CuisineEnum, MealTypeEnum, ProteinEnum, DishTypeEnum } from "./enums";
import { v4 as uuidv4 } from "uuid";

/* --------------------------------- Tables --------------------------------- */

export const recipesTable = sqliteTable("recipes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  title: text("title").notNull(),
  ingredients: text("ingredients", { mode: "text" }).notNull(),
  instructions: text("instructions", { mode: "text" }).notNull(),
  thumbnail: text("thumbnail").notNull(),
  lastSeen: text("last_seen"),
  createdOn: text("created_on").default(sql`CURRENT_TIMESTAMP`),
});

export const cuisinesTable = sqliteTable("cuisines", {
  name: text("name", {
    enum: Object.values(CuisineEnum) as [string, ...string[]],
  })
    .primaryKey()
    .notNull(),
});

export const mealTypesTable = sqliteTable("meal_types", {
  name: text("name", {
    enum: Object.values(MealTypeEnum) as [string, ...string[]],
  })
    .primaryKey()
    .notNull(),
});

export const proteinTypesTable = sqliteTable("proteins", {
  name: text("name", {
    enum: Object.values(ProteinEnum) as [string, ...string[]],
  })
    .primaryKey()
    .notNull(),
});

export const dishTypesTable = sqliteTable("dish_types", {
  name: text("name", {
    enum: Object.values(DishTypeEnum) as [string, ...string[]],
  })
    .primaryKey()
    .notNull(),
});

/* ------------------------ Nutrition Meta Data Table ----------------------- */

export const metaTable = sqliteTable("meta", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  recipeId: text("recipe_id")
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
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipesTable.id, { onDelete: "cascade" }),
  cuisine: text("cuisine")
    .notNull()
    .references(() => cuisinesTable.name),
});

export const recipesToMealTypes = sqliteTable("recipe_meal_type_association", {
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipesTable.id, { onDelete: "cascade" }),
  mealType: text("meal_type")
    .notNull()
    .references(() => mealTypesTable.name),
});

export const recipesToProteins = sqliteTable("recipe_protein_association", {
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipesTable.id, { onDelete: "cascade" }),
  protein: text("protein")
    .notNull()
    .references(() => proteinTypesTable.name),
});

export const recipesToDishTypes = sqliteTable("recipe_dish_type_association", {
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipesTable.id, { onDelete: "cascade" }),
  dishType: text("dish_type")
    .notNull()
    .references(() => dishTypesTable.name),
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
      fields: [recipesToCuisines.cuisine],
      references: [cuisinesTable.name],
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
      fields: [recipesToMealTypes.mealType],
      references: [mealTypesTable.name],
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
      fields: [recipesToProteins.protein],
      references: [proteinTypesTable.name],
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
      fields: [recipesToDishTypes.dishType],
      references: [dishTypesTable.name],
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
