CREATE TABLE `servings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`size` real NOT NULL,
	`size_unit` text NOT NULL,
	`protein_per_serving` real NOT NULL,
	`calories_per_serving` real NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `servings_recipe_id_unique` ON `servings` (`recipe_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`ingredients` text NOT NULL,
	`instructions` text NOT NULL,
	`thumbnail` text NOT NULL,
	`seen` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_recipes`("id", "title", "description", "ingredients", "instructions", "thumbnail", "seen") SELECT "id", "title", "description", "ingredients", "instructions", "thumbnail", "seen" FROM `recipes`;--> statement-breakpoint
DROP TABLE `recipes`;--> statement-breakpoint
ALTER TABLE `__new_recipes` RENAME TO `recipes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;