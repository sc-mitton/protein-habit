CREATE TABLE `cuisines` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dish_types` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meal_types` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meta` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_id` text NOT NULL,
	`number_of_servings` integer NOT NULL,
	`protein_per_serving` real NOT NULL,
	`calories_per_serving` real,
	`prep_time` integer NOT NULL,
	`cook_time` integer,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `meta_recipe_id_unique` ON `meta` (`recipe_id`);--> statement-breakpoint
CREATE TABLE `proteins` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`ingredients` text NOT NULL,
	`instructions` text NOT NULL,
	`thumbnail` text NOT NULL,
	`seen` integer,
	`order` integer,
	`created_on` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `recipe_cuisine_association` (
	`recipe_id` text NOT NULL,
	`cuisine` text NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cuisine`) REFERENCES `cuisines`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_dish_type_association` (
	`recipe_id` text NOT NULL,
	`dish_type` text NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`dish_type`) REFERENCES `dish_types`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_meal_type_association` (
	`recipe_id` text NOT NULL,
	`meal_type` text NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`meal_type`) REFERENCES `meal_types`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_protein_association` (
	`recipe_id` text NOT NULL,
	`protein` text NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`protein`) REFERENCES `proteins`(`name`) ON UPDATE no action ON DELETE no action
);
