PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`ingredients` text,
	`instructions` text,
	`thumbnail` text
);
--> statement-breakpoint
INSERT INTO `__new_recipes`("id", "title", "description", "ingredients", "instructions", "thumbnail") SELECT "id", "title", "description", "ingredients", "instructions", "thumbnail" FROM `recipes`;--> statement-breakpoint
DROP TABLE `recipes`;--> statement-breakpoint
ALTER TABLE `__new_recipes` RENAME TO `recipes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;