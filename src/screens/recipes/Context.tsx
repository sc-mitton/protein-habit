import React, { createContext, useContext, ReactNode, useState } from "react";
import { allFilters } from "@db/schema/enums";

interface RecipesScreenContextType {
  selectedFilters: {
    [key in keyof typeof allFilters]?: (typeof allFilters)[key][number];
  };
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{
      [key in keyof typeof allFilters]?: (typeof allFilters)[key][number];
    }>
  >;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const RecipesScreenContext = createContext<
  RecipesScreenContextType | undefined
>(undefined);

export const useRecipesScreenContext = () => {
  const context = useContext(RecipesScreenContext);
  if (!context) {
    throw new Error(
      "useRecipesScreenContext must be used within a RecipesScreenContextProvider",
    );
  }
  return context;
};

interface RecipesScreenContextProviderProps {
  children: ReactNode;
}

export const RecipesScreenContextProvider: React.FC<
  RecipesScreenContextProviderProps
> = ({ children }) => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key in keyof typeof allFilters]?: (typeof allFilters)[key][number];
  }>({});
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <RecipesScreenContext.Provider
      value={{
        selectedFilters,
        setSelectedFilters,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </RecipesScreenContext.Provider>
  );
};
