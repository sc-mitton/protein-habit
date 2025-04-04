import dayjs from "dayjs";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FontOption } from "@constants/fonts";
import { AccentOption } from "@constants/accents";
import { RootState } from "../index";
import { dayFormat } from "@constants/formats";
import { HomeStackParamList } from "@types";

interface UIState {
  font: FontOption;
  accent?: AccentOption;
  hasShownSuccessModal: boolean;
  day: string;
  seenScreens: (keyof HomeStackParamList)[];
}

const initialState: UIState = {
  font: "inter",
  accent: "blue",
  hasShownSuccessModal: false,
  day: dayjs().format(dayFormat),
  seenScreens: [],
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
    seeScreen: (state, action: PayloadAction<keyof HomeStackParamList>) => {
      state.seenScreens.push(action.payload);
    },
  },
});

export const { setFont, setAccent, setHasShownSuccessModal, seeScreen } =
  uiSlice.actions;
export default uiSlice.reducer;

export const selectFont = (state: RootState) => state.ui.font;
export const selectAccent = (state: RootState) => state.ui.accent;
export const selectInceptionDate = (state: RootState) =>
  state.user.inceptionDate;
export const selectHasShownSuccessModal = (state: RootState) =>
  state.ui.hasShownSuccessModal;
export const selectSeenScreens = (state: RootState) => state.ui.seenScreens;
