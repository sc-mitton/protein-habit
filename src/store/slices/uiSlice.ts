import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FontOption } from "@constants/fonts";
import { RootState } from "../index";

interface UIState {
  font: FontOption;
}

const initialState: UIState = {
  font: "inter",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFont: (state, action: PayloadAction<FontOption>) => {
      state.font = action.payload;
    },
  },
});

export const { setFont } = uiSlice.actions;
export default uiSlice.reducer;

export const selectFont = (state: RootState) => state.ui.font;
export const selectInceptionDate = (state: RootState) =>
  state.user.inceptionDate;
