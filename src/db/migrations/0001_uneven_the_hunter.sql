CREATE TABLE `recipe_dish_type_association` (
	`recipe_id` integer NOT NULL,
	`dish_type_id` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`dish_type_id`) REFERENCES `dish_types`(`id`) ON UPDATE no action ON DELETE no action
);
