import dayjs from "dayjs";

import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
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
      if (dayjs(state.entries[0][0]).isBefore(dayjs().format(dayFormat))) {
        state.entries.unshift([dayjs().format(dayFormat), []]);
      }
      const entry = state.entries[0][1];
      entry.push({
        grams: action.payload,
        id: Math.random().toString(36).slice(2, 11),
      });
      state.entries[0][1] = entry;
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

// Selectors
const selectTotalProteinForDay = (state: RootState, day: string) => {
  const dayEntry = state.protein.entries.find(([entryDay]) => {
    return dayjs(entryDay).isSame(dayjs(day), "day");
  });
  if (!dayEntry) return 0;
  return dayEntry[1].reduce((total, entry) => total + entry.grams, 0);
};
const selectDailyProteinTarget = (state: RootState) => {
  if (state.protein.dailyTarget) {
    return state.protein.dailyTarget;
  } else {
    return Math.round(
      state.user.weight
        ? state.user.weight.unit === "lbs"
          ? state.user.weight.value * 0.7
          : state.user.weight.value * 0.32
        : 70,
    );
  }
};

// Selector to get all protein records
const selectProteinAggregates = createSelector(
  [
    (state: RootState) => state.protein.entries,
    (_: RootState, month: string) => month,
  ],
  (entries, month) => {
    const date = dayjs(month, "YYYY-MM");

    const monthEntries = entries.filter(([day]) => {
      return dayjs(day).isSame(date, "month");
    });

    const totalProtein = monthEntries.reduce(
      (sum, [, dayEntries]) =>
        sum + dayEntries.reduce((daySum, entry) => daySum + entry.grams, 0),
      0,
    );

    const daysWithEntries = monthEntries.length;
    const avgProteinPerDay =
      daysWithEntries > 0 ? totalProtein / daysWithEntries : 0;

    return { avgProteinPerDay, totalProtein };
  },
);

const selectWeeklyAvgProtein = createSelector(
  (state: RootState) => state.protein.entries,
  (entries) => {
    const cutOff = dayjs().startOf("week").toISOString();

    return entries
      .slice(0, 7)
      .filter(([day]) => dayjs(day).isAfter(cutOff))
      .reduce((sum, dailyEntries) => {
        return sum + dailyEntries[1].reduce((sum, e) => sum + e.grams, 0);
      }, 0);
  },
);

const selectStreak = createSelector(
  (state: RootState) => state.protein.entries,
  selectDailyProteinTarget,
  (entries, target) => {
    let streak = 0;
    for (let i = 0; i < entries.length; i++) {
      const dailyEntries = entries[i][1];
      const totalProtein = dailyEntries.reduce((sum, e) => sum + e.grams, 0);
      if (totalProtein >= target) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },
);

export const { addProteinEntry, removeProteinEntry, setDailyTarget } =
  proteinSlice.actions;

export {
  selectProteinAggregates,
  selectDailyProteinTarget,
  selectTotalProteinForDay,
  selectWeeklyAvgProtein,
  selectStreak,
};
export default proteinSlice.reducer;
