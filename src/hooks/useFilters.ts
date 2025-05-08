import { useEffect, useState } from "react";
import { unionAll } from "drizzle-orm/sqlite-core";

import { useDrizzleDb } from "@db";
import {
  cuisinesTable,
  mealTypesTable,
  proteinTypesTable,
  dishTypesTable,
} from "@db/schema/schema";

export const useFilterOptions = () => {
  const db = useDrizzleDb();
  const [results, setResults] = useState<{ name: string }[]>([]);

  const fetchOptions = async () => {
    const result = await unionAll(
      db.select({ name: proteinTypesTable.name }).from(proteinTypesTable),
      db.select({ name: dishTypesTable.name }).from(dishTypesTable),
      db.select({ name: cuisinesTable.name }).from(cuisinesTable),
      db.select({ name: mealTypesTable.name }).from(mealTypesTable),
    );

    setResults(result);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return { fetchOptions, results };
};
