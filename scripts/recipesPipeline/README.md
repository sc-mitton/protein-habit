Guide to going from a csv of recipes titles to having them uploaded into the app
for all users.

1. Generate recipes (description and ingredients list) and relations
   `bun pipeline`
2. Manually generate the thumbnails with open ai or midjourney
3. Create uuid for thumbnail and upload thumbnail to s3
   `uuidgen`
4. Update the recipes db thumbnail field
   `update recipes where id=<> set thumbnail=<>`
5. Dump the sql lite db
   `sqlite3 recipes.db .dump > dump.sql`
6. Add a new migration for drizzle in the front end and copy and past the db dump
   `bunx drizzle-kit generate --custom --name new_recipes`
7. eas update to push the changes OTA
   `eas update --channel production -m "add new recipes"`
8. CLEAN UP: Delete dishes.csv and recipes.db
   `rm dishes.csv && rm recipes.db`
