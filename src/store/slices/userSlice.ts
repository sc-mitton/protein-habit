import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface UserState {
  name: string;
  weight: {
    value: number;
    unit: "kg" | "lbs";
  };
  age?: number;
  gender?: "male" | "female";
  inceptionDate: string;
  purchaseStatus: null | "base" | "premium";
}

export const initialState: UserState = {
  name: "",
  weight: {
    value: 0,
    unit: "lbs",
  },
  inceptionDate: new Date().toISOString(),
  purchaseStatus: null,
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
    setPurchaseStatus: (
      state,
      action: PayloadAction<UserState["purchaseStatus"]>,
    ) => {
      state.purchaseStatus = action.payload;
    },
  },
});

export const { setName, setWeight, setWeightUnit, setPurchaseStatus } =
  userSlice.actions;
export default userSlice.reducer;

export const selectUserInception = (state: RootState) => {
  return state.user.inceptionDate;
};

export const selectUserInfo = (state: RootState) => state.user;

export const selectUserPurchaseStatus = (state: RootState) =>
  state.user.purchaseStatus;
