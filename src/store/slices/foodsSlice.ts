import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface Food {
  id: string;
  name: string;
  emoji?: string;
  protein: number;
  servingSize?: number;
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
    removeFood: (state, action: PayloadAction<string>) => {
      state.foods = state.foods.filter((food) => food.id !== action.payload);
    },
  },
});

export const { addFood, removeFood } = foodsSlice.actions;

export const selectFoods = (state: RootState) => state.foods.foods;

export default foodsSlice.reducer;
