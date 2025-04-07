export const cuisines = [
  "italian",
  "mexican",
  "indian",
  "asian",
  "mediterranean",
] as const;

export const meals = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
] as const;

export const proteins = [
  "chicken",
  "steak",
  "ground_beef",
  "shrimp",
  "tofu",
  "fish",
  "lamb",
  "pork",
] as const;

export const dishes = [
  "salad",
  "soup",
  "sandwich",
  "bowl",
  "smoothie",
] as const;

export const allFilters = {
  protein: proteins,
  dish: dishes,
  meal: meals,
  cuisine: cuisines,
};

export const CuisineEnum = Object.fromEntries(
  cuisines.map((cuisine) => [cuisine.toUpperCase(), cuisine]),
) as { [K in Uppercase<(typeof cuisines)[number]>]: (typeof cuisines)[number] };

export const MealTypeEnum = Object.fromEntries(
  meals.map((meal) => [meal.toUpperCase(), meal]),
) as { [K in Uppercase<(typeof meals)[number]>]: (typeof meals)[number] };

export const ProteinEnum = Object.fromEntries(
  proteins.map((protein) => [protein.toUpperCase(), protein]),
) as { [K in Uppercase<(typeof proteins)[number]>]: (typeof proteins)[number] };

export const DishTypeEnum = Object.fromEntries(
  dishes.map((dish) => [dish.toUpperCase(), dish]),
) as { [K in Uppercase<(typeof dishes)[number]>]: (typeof dishes)[number] };

export type CuisineType = (typeof CuisineEnum)[keyof typeof CuisineEnum];
export type MealTypeType = (typeof MealTypeEnum)[keyof typeof MealTypeEnum];
export type ProteinType = (typeof ProteinEnum)[keyof typeof ProteinEnum];
export type DishTypeType = (typeof DishTypeEnum)[keyof typeof DishTypeEnum];
