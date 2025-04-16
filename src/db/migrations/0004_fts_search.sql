DROP TABLE IF EXISTS recipes_fts;
--> statement-breakpoint

CREATE VIRTUAL TABLE recipes_fts
USING fts5(id, title, tokenize='porter', prefix='2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20');
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
    INSERT INTO recipes_fts(recipes_fts, id, title)
    VALUES('delete', old.id, old.title);
END;
