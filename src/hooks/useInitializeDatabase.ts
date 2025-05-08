import { useEffect, useState } from "react";
import { initDatabase } from "../db";
import { seedDatabase } from "../db/seed/seed";

export const useInitializeDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        await seedDatabase();
        setIsInitialized(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize database",
        );
      }
    };

    initialize();
  }, []);

  return { isInitialized, error };
};
