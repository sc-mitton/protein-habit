ALTER TABLE `servings` RENAME TO `meta`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_meta` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`number_of_servings` integer NOT NULL,
	`protein_per_serving` real NOT NULL,
	`calories_per_serving` real,
	`prep_time` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_meta`("id", "recipe_id", "number_of_servings", "protein_per_serving", "calories_per_serving", "prep_time") SELECT "id", "recipe_id", "number_of_servings", "protein_per_serving", "calories_per_serving", "prep_time" FROM `meta`;--> statement-breakpoint
DROP TABLE `meta`;--> statement-breakpoint
ALTER TABLE `__new_meta` RENAME TO `meta`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `meta_recipe_id_unique` ON `meta` (`recipe_id`);--> statement-breakpoint
CREATE TABLE `__new_recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`ingredients` text NOT NULL,
	`instructions` text NOT NULL,
	`thumbnail` text NOT NULL,
	`last_seen` text
);
--> statement-breakpoint
INSERT INTO `__new_recipes`("id", "title", "ingredients", "instructions", "thumbnail", "last_seen") SELECT "id", "title", "ingredients", "instructions", "thumbnail", "last_seen" FROM `recipes`;--> statement-breakpoint
DROP TABLE `recipes`;--> statement-breakpoint
ALTER TABLE `__new_recipes` RENAME TO `recipes`;