import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { AccentOption } from "@constants/accents";

interface Tag {
  id: string;
  name: string;
  color: AccentOption;
}

export interface Food {
  id: string;
  name: string;
  emoji?: string;
  protein: number;
  servingSize?: number;
  isActive?: boolean;
  tags?: string[];
}

type NewFood = Omit<Food, "id">;

const initialState = {
  foods: [] as Food[],
  tags: [] as Tag[],
};

const foodsSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {
    addFood: (state, action: PayloadAction<NewFood>) => {
      state.foods.push({
        ...action.payload,
        id: Math.random().toString(36).slice(2, 15),
      });
    },
    addTag: (state, action: PayloadAction<Tag>) => {
      state.tags.push({
        ...action.payload,
        id: Math.random().toString(36).slice(2, 15),
      });
    },
    removeTag: (state, action: PayloadAction<string>) => {
      // Remove tag from foods
      state.foods = state.foods.map((food) => ({
        ...food,
        tags: food.tags?.filter((t) => t !== action.payload),
      }));
      state.tags = state.tags.filter((tag) => tag.id !== action.payload);
    },
    deactiveFood: (state, action: PayloadAction<string>) => {
      state.foods = state.foods.map((food) =>
        food.id === action.payload ? { ...food, isActive: false } : food,
      );
      // Remove tags that are no longer associated with any food
      state.tags = state.tags.filter((tag) =>
        state.foods.some((food) => food.tags?.some((t) => t === tag.id)),
      );
    },
    removeFood: (state, action: PayloadAction<string>) => {
      state.foods = state.foods.filter((food) => food.id !== action.payload);
      // Remove tags that are no longer associated with any food
      state.tags = state.tags.filter((tag) =>
        state.foods.some((food) => food.tags?.some((t) => t === tag.id)),
      );
    },
  },
});

export const { addFood, removeFood, deactiveFood, addTag, removeTag } =
  foodsSlice.actions;

export const selectFoods = createSelector(
  (state: RootState) => state.foods.foods,
  (foods) => foods.filter((f) => f.isActive || f.isActive === undefined),
);

export const selectTags = createSelector(
  (state: RootState) => state.foods.tags,
  (tags) => tags,
);

export default foodsSlice.reducer;
