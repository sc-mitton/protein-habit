import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "expo",
  schema: "./src/db/schema/schema.ts",
  out: "./src/db/migrations",
}) satisfies Config;
