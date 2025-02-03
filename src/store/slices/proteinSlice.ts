import dayjs from "dayjs";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Food } from "./foodsSlice";
import { dayFormat, timeFormat } from "@constants/formats";

interface ProteinEntry {
  id: string;
  grams: number;
  time: string;
  name?: string;
  food?: Food["id"];
}

export interface ProteinState {
  entries: Array<[date: string, entries: ProteinEntry[]]>;
  dailyTargets: [string, number | null][];
}

export const initialState: ProteinState = {
  entries: [[dayjs().format(dayFormat), []]],
  dailyTargets: [[dayjs().format(dayFormat), null]],
};

export const getRecommendedTarget = (weight: number, unit: "lbs" | "kg") => {
  return unit === "lbs" ? Math.round(weight * 0.7) : Math.round(weight * 0.32);
};

const proteinSlice = createSlice({
  name: "protein",
  initialState,
  reducers: {
    addEntry: (
      state,
      action: PayloadAction<
        | (Required<Pick<ProteinEntry, "grams">> & Pick<ProteinEntry, "name">)
        | Required<Pick<ProteinEntry, "food" | "grams">>
      >,
    ) => {
      if (dayjs(state.entries[0][0]).isBefore(dayjs().format(dayFormat))) {
        state.entries.unshift([dayjs().format(dayFormat), []]);
      }

      const entry = state.entries[0][1];
      entry.unshift({
        grams: action.payload.grams,
        id: Math.random().toString(36).slice(2, 11),
        time: dayjs().format(timeFormat),
        food: "food" in action.payload ? action.payload.food : undefined,
        name: "name" in action.payload ? action.payload.name : undefined,
      });
      state.entries[0][1] = entry;
    },
    removeEntry: (
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
    setDailyTarget: (
      state,
      action: PayloadAction<ProteinState["dailyTargets"][0][1]>,
    ) => {
      // Make sure to not build up multiple target changes in one day
      if (dayjs(state.dailyTargets[0][0]).isSame(dayjs(), "day")) {
        state.dailyTargets.shift();
      }

      state.dailyTargets.unshift([dayjs().format(dayFormat), action.payload]);
    },
    resetDailyTarget2Default: (state) => {
      // state.dailyTarget = 0;
      if (dayjs(state.dailyTargets[0][0]).isSame(dayjs(), "day")) {
        state.dailyTargets.shift();
      }
      state.dailyTargets.unshift([dayjs().format(dayFormat), null]);
    },
  },
});

export const {
  addEntry,
  removeEntry,
  setDailyTarget,
  resetDailyTarget2Default,
} = proteinSlice.actions;

export default proteinSlice.reducer;
