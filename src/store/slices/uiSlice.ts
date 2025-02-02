import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FontOption } from "@constants/fonts";
import { AccentOption } from "@constants/accents";
import { RootState } from "../index";

interface UIState {
  font: FontOption;
  accent?: AccentOption;
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
    setAccent: (state, action: PayloadAction<AccentOption | undefined>) => {
      state.accent = action.payload;
    },
  },
});

export const { setFont, setAccent } = uiSlice.actions;
export default uiSlice.reducer;

export const selectFont = (state: RootState) => state.ui.font;
export const selectAccent = (state: RootState) => state.ui.accent;
export const selectInceptionDate = (state: RootState) =>
  state.user.inceptionDate;
