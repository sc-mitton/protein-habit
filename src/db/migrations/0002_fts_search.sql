DROP TABLE IF EXISTS recipes_fts;
--> statement-breakpoint
CREATE VIRTUAL TABLE recipes_fts USING fts5(id, title);
--> statement-breakpoint
INSERT INTO recipes_fts (id, title)
SELECT id, title FROM recipes;
--> statement-breakpoint
DROP TRIGGER IF EXISTS recipes_fts_insert;
--> statement-breakpoint
CREATE TRIGGER recipes_fts_insert AFTER INSERT ON recipes
BEGIN
    INSERT INTO recipes_fts (id, title)
    VALUES (new.id, new.title);
END;
--> statement-breakpoint
DROP TRIGGER IF EXISTS recipes_fts_delete;
--> statement-breakpoint
CREATE TRIGGER recipes_fts_delete AFTER DELETE ON recipes
BEGIN
    INSERT INTO recipes_fts(recipes_fts, id, title) VALUES('delete', old.id, old.title);
END;
--> statement-breakpoint
DROP TRIGGER IF EXISTS recipes_fts_update;
--> statement-breakpoint
CREATE TRIGGER recipes_fts_update AFTER UPDATE ON recipes
BEGIN
    INSERT INTO recipes_fts(recipes_fts, id, title) VALUES('delete', old.id, old.title);
    INSERT INTO recipes_fts (id, title)
    VALUES (new.id, new.title);
END;
