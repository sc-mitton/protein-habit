-- Create FTS5 tables based on the recipes table
CREATE VIRTUAL TABLE recipes_fts USING fts5(id, title, description);

-- Insert data from recipes table into fts5 table
INSERT INTO recipes_fts (id, title, description)
SELECT id, title, description FROM recipes;


-- Create triggers for the fts5 table
CREATE TRIGGER recipes_fts_insert AFTER INSERT ON recipes
BEGIN
    INSERT INTO recipes_fts (id, title, description)
    VALUES (new.id, new.title, new.description);
END;
