import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface EntitlementState {
  value: string;
}

const initialState: EntitlementState = {
  value: "",
};

const entitlementSlice = createSlice({
  name: "entitlement",
  initialState,
  reducers: {
    setEntitlement: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setEntitlement } = entitlementSlice.actions;
export default entitlementSlice.reducer;

export const selectEntitlement = (state: RootState) => state.entitlement.value;
