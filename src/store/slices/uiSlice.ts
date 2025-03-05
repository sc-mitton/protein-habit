import dayjs from "dayjs";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FontOption } from "@constants/fonts";
import { AccentOption } from "@constants/accents";
import { RootState } from "../index";
import { dayFormat } from "@constants/formats";

interface UIState {
  font: FontOption;
  accent?: AccentOption;
  hasShownSuccessModal: boolean;
  day: string;
}

const initialState: UIState = {
  font: "inter",
  accent: "blue",
  hasShownSuccessModal: false,
  day: dayjs().format(dayFormat),
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
    setHasShownSuccessModal: (state, action: PayloadAction<boolean>) => {
      state.hasShownSuccessModal = action.payload;
    },
  },
});

export const { setFont, setAccent, setHasShownSuccessModal } = uiSlice.actions;
export default uiSlice.reducer;

export const selectFont = (state: RootState) => state.ui.font;
export const selectAccent = (state: RootState) => state.ui.accent;
export const selectInceptionDate = (state: RootState) =>
  state.user.inceptionDate;
export const selectHasShownSuccessModal = (state: RootState) =>
  state.ui.hasShownSuccessModal;
