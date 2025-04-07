import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@db/schema";

export function useDrizzleDb() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  return { db: drizzleDb };
}
