import dayjs from "dayjs";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Food } from "./foodsSlice";
import { dayFormat, timeFormat } from "@constants/formats";

export interface ProteinEntry {
  id: string;
  grams: number;
  time: string;
  name?: string;
  description?: string;
  food?: Food["id"];
}

type DailyTarget = [string, number];

export interface ProteinState {
  entries: Array<[date: string, entries: ProteinEntry[]]>;
  dailyTargets: [string, number][];
}

export const initialState: ProteinState = {
  entries: [[dayjs().format(dayFormat), []]],
  dailyTargets: [[dayjs().format(dayFormat), 0]],
};

export const getRecommendedTarget = (weight: number, unit: "lbs" | "kg") => {
  return unit === "lbs" ? Math.round(weight * 0.7) : Math.round(weight * 0.32);
};

type ProteinEntryPayload = (
  | (Required<Pick<ProteinEntry, "grams">> & Pick<ProteinEntry, "name">)
  | { food: Food; amount: number }
) & {
  day: string;
};

const proteinSlice = createSlice({
  name: "protein",
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<ProteinEntryPayload>) => {
      // Find the index of the entries list
      // There may be no entries list for the day, so we need to insert one in that case
      let entriesIndex = 0;
      for (let i = state.entries.length - 1; i >= 0; i--) {
        if (
          dayjs(state.entries[i][0]).isSame(dayjs(action.payload.day), "day")
        ) {
          entriesIndex = i;
          break;
        } else if (
          dayjs(state.entries[i][0]).isBefore(dayjs(action.payload.day), "day")
        ) {
          entriesIndex = i + 1;
          state.entries.splice(i + 1, 0, [
            dayjs(action.payload.day).format(dayFormat),
            [],
          ]);
          break;
        }
      }

      state.entries[entriesIndex][1].push({
        grams:
          "food" in action.payload
            ? action.payload.food.protein * action.payload.amount
            : action.payload.grams,
        id: Math.random().toString(36).slice(2, 11),
        time: dayjs().format(timeFormat),
        food: "food" in action.payload ? action.payload.food.id : undefined,
        name: "name" in action.payload ? action.payload.name : undefined,
        description:
          "food" in action.payload
            ? `${action.payload.food.emoji ? action.payload.food.emoji + " " : ""} ${action.payload.food.name}`
            : undefined,
      });
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
    updateEntry: (state, action: PayloadAction<ProteinEntry>) => {
      const dayIndex = state.entries.findIndex(([, entries]) =>
        entries.some((entry) => entry.id === action.payload.id),
      );
      if (dayIndex !== -1) {
        const entryIndex = state.entries[dayIndex][1].findIndex(
          (e) => e.id === action.payload.id,
        );
        state.entries[dayIndex][1][entryIndex] = action.payload;
      }
    },
    setDailyTarget: (state, action: PayloadAction<DailyTarget[1]>) => {
      // Make sure to not build up multiple target changes in one day
      if (
        dayjs(state.dailyTargets[state.dailyTargets.length - 1][0]).isSame(
          dayjs(),
          "day",
        )
      ) {
        state.dailyTargets.shift();
      }

      state.dailyTargets.push([dayjs().format(dayFormat), action.payload]);
    },
  },
});

export const { addEntry, removeEntry, setDailyTarget, updateEntry } =
  proteinSlice.actions;

export default proteinSlice.reducer;
