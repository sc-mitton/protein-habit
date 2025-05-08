import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useFilterOptions } from "@hooks";

interface RecipesScreenContextType {
  selectedFilters: { [key: string]: string };
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOptions: { [key: string]: string[] };
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
    [key: string]: string;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState<{
    [key: string]: string[];
  }>({});
  const queriedFilterOptions = useFilterOptions();

  useEffect(() => {
    setFilterOptions(queriedFilterOptions);
  }, [queriedFilterOptions]);

  return (
    <RecipesScreenContext.Provider
      value={{
        selectedFilters,
        setSelectedFilters,
        searchQuery,
        setSearchQuery,
        filterOptions,
      }}
    >
      {children}
    </RecipesScreenContext.Provider>
  );
};
