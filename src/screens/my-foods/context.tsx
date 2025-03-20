import { createContext, useContext, ReactNode, useState } from "react";
import dayjs from "dayjs";
import { dayFormat } from "@constants/formats";
import { Food } from "@store/slices/foodsSlice";

interface MyFoodsContextType {
  searchString: string;
  setSearchString: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  day: string;
  setDay: (day: string) => void;
  selectedFoods: {
    food: Food;
    amount: number;
  }[];
  setSelectedFoods: React.Dispatch<
    React.SetStateAction<
      {
        food: Food;
        amount: number;
      }[]
    >
  >;
}

const MyFoodsContext = createContext<MyFoodsContextType | undefined>(undefined);

export function MyFoodsProvider({ children }: { children: ReactNode }) {
  const [searchString, setSearchString] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<
    {
      food: Food;
      amount: number;
    }[]
  >([]);

  const [day, setDay] = useState(dayjs().format(dayFormat));

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const clearFilters = () => {
    setSearchString("");
    setSelectedTags([]);
  };

  return (
    <MyFoodsContext.Provider
      value={{
        selectedFoods,
        setSelectedFoods,
        searchString,
        setSearchString,
        selectedTags,
        setSelectedTags,
        toggleTag,
        clearFilters,
        day,
        setDay,
      }}
    >
      {children}
    </MyFoodsContext.Provider>
  );
}

export function useMyFoods() {
  const context = useContext(MyFoodsContext);
  if (context === undefined) {
    throw new Error("useMyFoods must be used within a MyFoodsProvider");
  }
  return context;
}
