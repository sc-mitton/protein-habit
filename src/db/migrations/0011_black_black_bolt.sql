PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_meta` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`number_of_servings` integer NOT NULL,
	`protein_per_serving` real NOT NULL,
	`calories_per_serving` real,
	`prep_time` integer NOT NULL,
	`cook_time` integer,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_meta`("id", "recipe_id", "number_of_servings", "protein_per_serving", "calories_per_serving", "prep_time", "cook_time") SELECT "id", "recipe_id", "number_of_servings", "protein_per_serving", "calories_per_serving", "prep_time", "cook_time" FROM `meta`;--> statement-breakpoint
DROP TABLE `meta`;--> statement-breakpoint
ALTER TABLE `__new_meta` RENAME TO `meta`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `meta_recipe_id_unique` ON `meta` (`recipe_id`);--> statement-breakpoint
CREATE TABLE `__new_recipe_cuisine_association` (
	`recipe_id` integer NOT NULL,
	`cuisine_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cuisine_id`) REFERENCES `cuisines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recipe_cuisine_association`("recipe_id", "cuisine_id") SELECT "recipe_id", "cuisine_id" FROM `recipe_cuisine_association`;--> statement-breakpoint
DROP TABLE `recipe_cuisine_association`;--> statement-breakpoint
ALTER TABLE `__new_recipe_cuisine_association` RENAME TO `recipe_cuisine_association`;--> statement-breakpoint
CREATE TABLE `__new_recipe_dish_type_association` (
	`recipe_id` integer NOT NULL,
	`dish_type_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`dish_type_id`) REFERENCES `dish_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recipe_dish_type_association`("recipe_id", "dish_type_id") SELECT "recipe_id", "dish_type_id" FROM `recipe_dish_type_association`;--> statement-breakpoint
DROP TABLE `recipe_dish_type_association`;--> statement-breakpoint
ALTER TABLE `__new_recipe_dish_type_association` RENAME TO `recipe_dish_type_association`;--> statement-breakpoint
CREATE TABLE `__new_recipe_meal_type_association` (
	`recipe_id` integer NOT NULL,
	`meal_type_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recipe_meal_type_association`("recipe_id", "meal_type_id") SELECT "recipe_id", "meal_type_id" FROM `recipe_meal_type_association`;--> statement-breakpoint
DROP TABLE `recipe_meal_type_association`;--> statement-breakpoint
ALTER TABLE `__new_recipe_meal_type_association` RENAME TO `recipe_meal_type_association`;--> statement-breakpoint
CREATE TABLE `__new_recipe_protein_association` (
	`recipe_id` integer NOT NULL,
	`protein_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`protein_id`) REFERENCES `proteins`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recipe_protein_association`("recipe_id", "protein_id") SELECT "recipe_id", "protein_id" FROM `recipe_protein_association`;--> statement-breakpoint
DROP TABLE `recipe_protein_association`;--> statement-breakpoint
ALTER TABLE `__new_recipe_protein_association` RENAME TO `recipe_protein_association`;