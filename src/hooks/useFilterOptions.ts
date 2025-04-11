import { useEffect, useState } from "react";
import { unionAll } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { useDrizzleDb } from "./useDrizzleDb";
import {
  cuisinesTable,
  mealTypesTable,
  proteinTypesTable,
  dishTypesTable,
} from "@db/schema/schema";

export const useFilterOptions = () => {
  const { db } = useDrizzleDb();
  const [results, setResults] = useState<{ [key: string]: string[] }>({});

  const fetchOptions = async () => {
    const results = await unionAll(
      db
        .select({
          name: proteinTypesTable.name,
          type: sql`'protein'`.mapWith(String),
        })
        .from(proteinTypesTable),
      db
        .select({
          name: dishTypesTable.name,
          type: sql`'dish'`.mapWith(String),
        })
        .from(dishTypesTable),
      db
        .select({
          name: cuisinesTable.name,
          type: sql`'cuisine'`.mapWith(String),
        })
        .from(cuisinesTable),
      db
        .select({
          name: mealTypesTable.name,
          type: sql`'meal'`.mapWith(String),
        })
        .from(mealTypesTable),
    );

    const groupedResults = results.reduce(
      (acc, { type, ...rest }) => {
        if (!acc[type]) acc[type] = [];
        acc[type].push(rest.name);
        return acc;
      },
      {} as { [key: string]: string[] },
    );

    setResults(groupedResults);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return results;
};
