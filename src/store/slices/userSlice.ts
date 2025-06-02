import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "..";

interface UserState {
  id: string;
  name: string;
  weight: {
    value: number;
    unit: "kg" | "lbs";
  };
  age?: number;
  gender?: "male" | "female";
  inceptionDate: string;
}

export const initialState: UserState = {
  id: Math.random().toString(36).substring(2, 15),
  name: "",
  weight: {
    value: 0,
    unit: "lbs",
  },
  inceptionDate: new Date().toISOString(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setWeight: (state, action: PayloadAction<number>) => {
      state.weight.value = action.payload;
    },
    setWeightUnit: (state, action: PayloadAction<"kg" | "lbs">) => {
      state.weight.unit = action.payload;
    },
  },
});

export const { setName, setWeight, setWeightUnit } = userSlice.actions;
export default userSlice.reducer;

export const selectUserInception = (state: RootState) => {
  return state.user.inceptionDate;
};

export const selectUserInfo = (state: RootState) => state.user;
