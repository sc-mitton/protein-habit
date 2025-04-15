-- Trigger to set initial order value and seen count for new recipes
CREATE TRIGGER IF NOT EXISTS tr_recipes_insert_defaults
AFTER INSERT ON recipes
BEGIN
    UPDATE recipes
    SET
        -- Random 9 digit number for order
        "order" = ABS(RANDOM() % 1000000000),
        -- Get minimum seen value from existing recipes, defaulting to 0 if no rows exist
        seen = COALESCE((SELECT MIN(seen) FROM recipes WHERE id != NEW.id), 0)
    WHERE id = NEW.id;
END;
