import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface Food {
  id: string;
  name: string;
  emoji?: string;
  protein: number;
  servingSize?: number;
  isActive?: boolean;
}

const initialState = {
  foods: [] as Food[],
};

const foodsSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {
    addFood: (state, action: PayloadAction<Food>) => {
      state.foods.push(action.payload);
    },
    deactiveFood: (state, action: PayloadAction<string>) => {
      state.foods = state.foods.map((food) =>
        food.id === action.payload ? { ...food, isActive: false } : food,
      );
    },
    removeFood: (state, action: PayloadAction<string>) => {
      state.foods = state.foods.filter((food) => food.id !== action.payload);
    },
  },
});

export const { addFood, removeFood, deactiveFood } = foodsSlice.actions;

export const selectFoods = createSelector(
  (state: RootState) => state.foods.foods,
  (foods) => foods.filter((f) => f.isActive || f.isActive === undefined),
);

export default foodsSlice.reducer;
