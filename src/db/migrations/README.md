There will come a time when we probably want to add more recipes to the db.
This can be tricky since we want to preserve the state of the current db on device,
but add new rows to the right tables.

Assuming that we first have generated a bunch of data with the generateRecipes.ts
and generateImages.ts scripts, we can clean up that db to make it into a migration
that will run on users devices to get the new recipes.

1. Drop unecessary tables

```
drop table __drizzle_migrations;
drop table cuisines;
drop table dish_types;
drop table meal_types;
drop table proteins;
drop table recipes_fts;
drop trigger recipes_fts_insert;
drop trigger recipes_fts_delete;
drop trigger recipes_fts_update;
```

2. Dump the db

```
sqlite3 recipes.db .dump > dump.sql
```

3. Make a new custom migration

```
bunx drizzle-kit generate --custom --name='db_dump'
```

4. Copy and past the the dumped sql into the migation file

5. Remove the create tables ddl so it doesn't crash the app on launch. (Since the tables already exist)l

6. Should be good from here
