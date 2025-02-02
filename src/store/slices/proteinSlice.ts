import dayjs from "dayjs";

import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Food } from "./foodsSlice";
import { dayFormat, timeFormat } from "@constants/formats";

interface ProteinEntry {
  id: string;
  grams: number;
  time: string;
  name?: string;
  food?: Food["id"];
}

interface ProteinState {
  entries: Array<[string, ProteinEntry[]]>;
  dailyTargets: [string, number | null][];
}

export const initialState: ProteinState = {
  entries: [[dayjs().format(dayFormat), []]],
  dailyTargets: [[dayjs().format(dayFormat), null]],
};

const getRecommendedTarget = (weight: number, unit: "lbs" | "kg") => {
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

// Selectors
const selectTotalProteinForDay = (state: RootState, day: string) => {
  const dayEntry = state.protein.entries.find(([entryDay]) => {
    return dayjs(entryDay).isSame(dayjs(day), "day");
  });
  if (!dayEntry) return 0;
  return dayEntry[1].reduce((total, entry) => total + entry.grams, 0);
};
const selectDailyProteinTarget = (state: RootState) => {
  if (state.protein.dailyTargets[0][1]) {
    return state.protein.dailyTargets[0][1];
  } else {
    return getRecommendedTarget(
      state.user.weight.value,
      state.user.weight.unit,
    );
  }
};

// Selector to get all protein records
const selectAggregates = createSelector(
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

const selectWeeklyAvg = createSelector(
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

// Return a list of all days from the start argument
// with the entry totals for each day, and whether the target was met
const selectDailyTargetResults = createSelector(
  (state: RootState) => state.protein.entries,
  (_: RootState, start: string) => start,
  (state: RootState) => state.protein.dailyTargets,
  (state: RootState) => state.user.weight,
  (entries, start, targets, weight) => {
    // [day, totalProtein, targetMet, target]
    const results = [] as [string, number, boolean, number][];

    // The resulting array should go from present to the start
    // [curent day, current day - 1, ..., start]

    const daysSinceLastEntry = dayjs(start).diff(dayjs(entries[0][0]), "day");
    const target =
      targets[0][1] ?? getRecommendedTarget(weight.value, weight.unit);
    // Fill in start
    for (let i = 0; i < daysSinceLastEntry; i++) {
      results.push([
        dayjs().subtract(i, "day").format(dayFormat),
        0,
        false,
        target,
      ]);
    }

    // Don't return result for current day
    let i = dayjs(entries[0][0]).isSame(dayjs(), "day") ? 1 : 0;

    for (i; i < entries.length; i++) {
      const target =
        targets.find(([day]) => {
          return dayjs(day).subtract(1, "day").isBefore(entries[i][0]);
        })?.[1] ?? getRecommendedTarget(weight.value, weight.unit);

      // Fill in gap if any
      const gap =
        dayjs(entries[i][0]).diff(
          dayjs(results[results.length - 1]?.[0]),
          "day",
        ) - 1;

      for (let j = 0; j < gap; j++) {
        const day = dayjs(entries[i][0]).subtract(j, "day").format(dayFormat);
        results.push([day, 0, false, target]);
      }

      const totalProtein = entries[i][1].reduce((sum, e) => sum + e.grams, 0);
      results.push([
        entries[i][0],
        totalProtein,
        totalProtein >= target,
        target,
      ]);
    }

    // Fill in end
    const totalResultsLength = dayjs().diff(dayjs(start), "day");
    const gap = totalResultsLength - results.length;

    for (let i = 1; i <= gap; i++) {
      const day = dayjs(results[results.length - 1]?.[0]).subtract(i, "day");
      const target =
        targets.find(([d]) => {
          return dayjs(d).subtract(1, "day").isBefore(day);
        })?.[1] ?? getRecommendedTarget(weight.value, weight.unit);

      results.push([day.format(dayFormat), 0, false, target]);
    }

    return results;
  },
);

const selectTodaysEntries = (state: RootState) => {
  return dayjs(state.protein.entries[0][0]).isSame(dayjs(), "day")
    ? state.protein.entries[0][1]
    : [];
};

const selectStreak = createSelector(
  (state: RootState) => state.protein.entries,
  (state: RootState) => state.protein.dailyTargets,
  (state: RootState) => state.user.weight,
  (entries, targets, weight) => {
    let streak = 0;
    const defaultTarget = getRecommendedTarget(weight.value, weight.unit);

    for (let i = 0; i < entries.length; i++) {
      const dailyEntries = entries[i][1];
      const totalProtein = dailyEntries.reduce((sum, e) => sum + e.grams, 0);
      const target =
        targets.find(([day]) => dayjs(day).isBefore(entries[i][0]))?.[1] ??
        defaultTarget;
      if (totalProtein >= target) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  },
);

export const {
  addEntry,
  removeEntry,
  setDailyTarget,
  resetDailyTarget2Default,
} = proteinSlice.actions;

export {
  selectAggregates,
  selectDailyProteinTarget,
  selectTotalProteinForDay,
  selectWeeklyAvg,
  selectStreak,
  selectDailyTargetResults,
  selectTodaysEntries,
};
export default proteinSlice.reducer;
