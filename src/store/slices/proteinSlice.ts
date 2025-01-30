import dayjs from "dayjs";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface ProteinEntry {
  id: string;
  grams: number;
}

interface ProteinState {
  entries: Array<[string, ProteinEntry[]]>;
  dailyTarget: number;
}

const dayFormat = "MM-DD-YYYY";

const initialState: ProteinState = {
  entries: [[dayjs().format(dayFormat), []]],
  dailyTarget: 0,
};

const proteinSlice = createSlice({
  name: "protein",
  initialState,
  reducers: {
    addProteinEntry: (state, action: PayloadAction<number>) => {
      if (dayjs(state.entries[0][0]).isBefore(dayjs())) {
        state.entries.unshift([dayjs().format(dayFormat), []]);
      }
      const currentDayEntry = state.entries[0][1];
      currentDayEntry.push({
        grams: action.payload,
        id: Math.random().toString(36).slice(2, 11),
      });
    },
    removeProteinEntry: (
      state,
      action: PayloadAction<{ day: string; id: string }>,
    ) => {
      const dayIndex = state.entries.findIndex(([day]) =>
        dayjs(day).isSame(action.payload.day),
      );
      if (dayIndex !== -1) {
        state.entries[dayIndex][1] = state.entries[dayIndex][1].filter(
          (entry) => entry.id !== action.payload.id,
        );
      }
    },
    setDailyTarget: (state, action: PayloadAction<number>) => {
      state.dailyTarget = action.payload;
    },
  },
});

export const { addProteinEntry, removeProteinEntry, setDailyTarget } =
  proteinSlice.actions;

// Selectors
export const selectTotalProteinForDay = (state: RootState, day: string) => {
  const dayEntry = state.protein.entries.find(([entryDay]) =>
    dayjs(entryDay).isSame(dayjs(day), "day"),
  );
  if (!dayEntry) return 0;
  return dayEntry[1].reduce((total, entry) => total + entry.grams, 0);
};
export const selectDailyTarget = (state: RootState) =>
  state.protein.dailyTarget;

export default proteinSlice.reducer;
