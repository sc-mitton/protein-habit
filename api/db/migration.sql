-- Step 1: Create new menustat table with renamed column
CREATE TABLE restaurant_menu_foods (
    id INTEGER,
    restaurant TEXT,
    food_category TEXT,
    description TEXT,  -- Renamed from item_description
    energy_amount REAL,
    fat_amount REAL,
    carb_amount REAL,
    protein_amount REAL,
    serving_size REAL,
    serving_unit TEXT
);

-- Step 2: Copy data from old menustat table
INSERT INTO restaurant_menu_foods (id, restaurant, food_category, description, energy_amount, fat_amount, carb_amount, protein_amount, serving_size, serving_unit)
SELECT menustat_id, restaurant, food_category, item_description, energy_amount, fat_amount, carb_amount, protein_amount, serving_size, serving_size_unit
FROM menustat;

-- Step 3: Drop old menustat table
DROP TABLE menustat;

-- Step 5: Create new usda_non_branded_column table
CREATE TABLE non_branded_foods (id INTEGER, description, energy_amount REAL, fat_amount REAL, carb_amount REAL, protein_amount REAL, serving_size REAL);

-- Step 6: Copy data from old usda_non_branded_column table
INSERT INTO non_branded_foods (id , description, energy_amount, fat_amount, carb_amount, protein_amount, serving_size)
SELECT fdc_id, description, energy_amount, fat_amount, carb_amount, protein_amount, serving_size
FROM usda_non_branded_column;

-- Step 7: Drop old usda_non_branded_column table
DROP TABLE usda_non_branded_column;

-- Step 9: Create new usda_branded_column table
CREATE TABLE branded_foods (id INTEGER, description TEXT, brand_name TEXT, food_category TEXT, energy_amount REAL, fat_amount REAL, carb_amount REAL, protein_amount REAL, serving_size REAL, serving_unit TEXT);

-- Step 10: Copy data from old usda_branded_column table
INSERT INTO branded_foods (id , description, brand_name, food_category, energy_amount, fat_amount, carb_amount, protein_amount, serving_size, serving_unit)
SELECT fdc_id, description, brand_name, food_category, energy_amount, fat_amount, carb_amount, protein_amount, serving_size, serving_size_unit
FROM usda_branded_column;

-- Step 11: Drop old usda_branded_column table
DROP TABLE usda_branded_column;

/* -------------------------------- Clean Up -------------------------------- */

-- Deduplicate restaurant_menu_foods based on description
DELETE FROM restaurant_menu_foods
WHERE rowid NOT IN (
    SELECT MIN(rowid)
    FROM restaurant_menu_foods
    GROUP BY description
);

-- Deduplicate non_branded_foods based on description
DELETE FROM non_branded_foods
WHERE rowid NOT IN (
    SELECT MIN(rowid)
    FROM non_branded_foods
    GROUP BY description
);

-- Deduplicate branded_foods based on description
DELETE FROM branded_foods
WHERE rowid NOT IN (
    SELECT MIN(rowid)
    FROM branded_foods
    GROUP BY description
);

-- Remove all rows that have null in any of the nutrition fields
DELETE FROM restaurant_menu_foods
WHERE energy_amount IS NULL OR fat_amount IS NULL OR carb_amount IS NULL OR protein_amount IS NULL;

DELETE FROM non_branded_foods
WHERE energy_amount IS NULL OR fat_amount IS NULL OR carb_amount IS NULL OR protein_amount IS NULL;

DELETE FROM branded_foods
WHERE energy_amount IS NULL OR fat_amount IS NULL OR carb_amount IS NULL OR protein_amount IS NULL;

/* ------------------------------- Create FTS5 Tables ------------------------------- */

-- Create fts5 tables
--    - Search fields: description (and also restaurant for restaurant_menu_foods)
--    - Include all other fields from original tables
CREATE VIRTUAL TABLE restaurant_menu_foods_fts USING fts5(id, description, restaurant);
CREATE VIRTUAL TABLE non_branded_foods_fts USING fts5(id, description, brand_name);
CREATE VIRTUAL TABLE branded_foods_fts USING fts5(id, description, brand_name);

-- Insert all fields from original tables into fts5 tables, and drop old tables
INSERT INTO restaurant_menu_foods_fts (id, description, restaurant) SELECT id, description, restaurant FROM restaurant_menu_foods;
INSERT INTO non_branded_foods_fts (id, description) SELECT id, description FROM non_branded_foods;
INSERT INTO branded_foods_fts (id, description, brand_name) SELECT id, description, brand_name FROM branded_foods;
