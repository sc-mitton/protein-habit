CREATE TABLE `cuisines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cuisines_name_unique` ON `cuisines` (`name`);--> statement-breakpoint
CREATE TABLE `dish_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dish_types_name_unique` ON `dish_types` (`name`);--> statement-breakpoint
CREATE TABLE `meal_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `meal_types_name_unique` ON `meal_types` (`name`);--> statement-breakpoint
CREATE TABLE `proteins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `proteins_name_unique` ON `proteins` (`name`);--> statement-breakpoint
CREATE TABLE `recipe_cuisine_association` (
	`recipe_id` integer NOT NULL,
	`cuisine_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cuisine_id`) REFERENCES `cuisines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_meal_type_association` (
	`recipe_id` integer NOT NULL,
	`meal_type_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_protein_association` (
	`recipe_id` integer NOT NULL,
	`protein_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`protein_id`) REFERENCES `proteins`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text,
	`ingredients` text,
	`instructions` text,
	`thumbnail` text,
	`dish_type_id` integer,
	FOREIGN KEY (`dish_type_id`) REFERENCES `dish_types`(`id`) ON UPDATE no action ON DELETE no action
);
