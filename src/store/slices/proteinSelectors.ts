import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import Big from "big.js";

import { RootState } from "..";
import { dayFormat } from "@constants/formats";
import { getRecommendedTarget } from "./proteinSlice";

// Selectors
const selectTotalProteinForDay = (state: RootState, day: string) => {
  return (
    state.protein.entries
      .find(([entryDay]) => {
        return dayjs(entryDay).isSame(dayjs(day), "day");
      })?.[1]
      .reduce((total, entry) => total + entry.grams, 0) ?? 0
  );
};

const selectDailyProteinTarget = (state: RootState) => {
  return (
    state.protein.dailyTargets[state.protein.dailyTargets.length - 1][1] ??
    getRecommendedTarget(state.user.weight.value, state.user.weight.unit)
  );
};

// Returns the average protein intake per day for a given month
const selectMonthlyDailyAverage = createSelector(
  [
    (state: RootState) => state.protein.entries,
    (state: RootState) => state.user,
    (_: RootState, month: string) => month,
  ],
  (entries, user, month) => {
    const date = dayjs(month, "YYYY-MM");

    const totalProtein = entries
      .filter(([day]) => {
        return (
          dayjs(day).isSame(date, "month") &&
          dayjs(day).isBefore(dayjs(), "day")
        );
      })
      .reduce(
        (sum, [, dayEntries]) =>
          sum + dayEntries.reduce((daySum, entry) => daySum + entry.grams, 0),
        0,
      );

    const daysWithEntries = entries.filter(([day]) => {
      return (
        dayjs(day).isSame(date, "month") && dayjs(day).isBefore(dayjs(), "day")
      );
    }).length;

    // How many days are we averaging over?
    // It could be
    // 1 number of days with entries in the month
    // 2 days since the users inception
    // 3 number of days in the month
    // 4 today minus the start of the month
    // When should it be each of these?
    // - Always choose min of 3 & 4
    // - Of above result choose min of that and 2
    // - Choose max of that and 1
    const denominator = Math.max(
      daysWithEntries,
      Math.min(
        dayjs().diff(dayjs(user.inceptionDate), "day"),
        Math.min(
          dayjs().diff(date.startOf("month"), "day"),
          date.daysInMonth(),
        ),
      ),
    );

    const avgProteinPerDay =
      daysWithEntries > 0
        ? Big(totalProtein).div(denominator).round(1).toNumber()
        : 0;

    return { avgProteinPerDay, totalProtein };
  },
);

const selectDailyAvg = createSelector(
  (state: RootState) => state.protein.entries,
  (state: RootState) => state.user,
  (_: RootState, start: string) => start,
  (entries, user, start) => {
    const startDayjs = dayjs(start).isBefore(user.inceptionDate)
      ? dayjs(user.inceptionDate)
      : dayjs(start);

    const numDays = dayjs().diff(dayjs(startDayjs.startOf("day")), "day");
    if (numDays === 0) {
      return 0;
    }

    const result =
      entries
        .filter(
          ([day]) =>
            dayjs(day).isAfter(startDayjs.subtract(1, "day"), "day") &&
            dayjs(day).isBefore(dayjs(), "day"),
        )
        .reduce((sum, dailyEntries) => {
          return sum + dailyEntries[1].reduce((sum, e) => sum + e.grams, 0);
        }, 0) / numDays;

    // round result to 1 decimal place
    return Math.round(result * 10) / 10;
  },
);

// Return a list of all days from the start argument
// with the entry totals for each day, and whether the target was met
const selectDailyTargetResults = createSelector(
  (state: RootState) => state.protein.entries,
  (_: RootState, start: string) => start,
  (state: RootState) => state.protein.dailyTargets,
  (entries, start, targets) => {
    // The resulting array should go from start (user inception date) to the present
    // [start, start + 1, ..., current day]

    // [day, totalProtein, targetMet, target]
    const results = [] as [string, number, boolean, number][];

    const iterLength = dayjs().diff(dayjs(start), "day");

    const entryMap = {} as Record<string, number>;
    for (let i = entries.length - 1; i >= 0; i--) {
      entryMap[entries[i][0]] = i;
    }

    let targetIndex = 0;

    for (let i = 0; i < iterLength; i++) {
      const day = dayjs(start).add(i, "day");

      if (
        targetIndex < targets.length - 1 &&
        dayjs(targets[targetIndex + 1][0])
          .subtract(1, "day")
          .isBefore(day)
      ) {
        targetIndex++;
      }

      const entryIndex = entryMap[day.format(dayFormat)];
      const totalProtein =
        entryIndex === undefined
          ? 0
          : entries[entryIndex][1].reduce((sum, e) => sum + e.grams, 0);
      const target = targets[targetIndex][1];

      results.push([
        day.format(dayFormat),
        totalProtein,
        totalProtein >= target,
        target,
      ]);
    }

    const todaysTotals = entries
      .find(([entryDay]) => {
        return dayjs(entryDay).isSame(dayjs(), "day");
      })?.[1]
      .reduce((sum, e) => sum + e.grams, 0);

    const todaysTarget = targets[targets.length - 1][1];

    if (todaysTotals && todaysTarget && todaysTotals >= todaysTarget) {
      results.push([
        dayjs().format(dayFormat),
        todaysTotals,
        true,
        todaysTarget,
      ]);
    }

    return results;
  },
);

// const selectTodaysEntries = (state: RootState) => {
//   return dayjs(state.protein.entries[0][0]).isSame(dayjs(), "day")
//     ? state.protein.entries[0][1]
//     : [];
// };

const selectDaysEntries = createSelector(
  (state: RootState) => state.protein.entries,
  (_: RootState, day: string) => day,
  (entries, day) => {
    return entries
      .findLast(([entryDay]) => {
        return dayjs(entryDay).isSame(dayjs(day), "day");
      })?.[1]
      .slice()
      .reverse();
  },
);

const selectStreak = createSelector(
  (state: RootState) => state.protein.entries,
  (state: RootState) => state.protein.dailyTargets,
  (state: RootState) => state.user.weight,
  (entries, targets, weight) => {
    let streak = 0;
    let targetIndex = targets.length - 1;
    let day = dayjs();

    for (let i = entries.length - 1; i >= 0; i--) {
      // If gap in entires, break streak
      if (Math.abs(dayjs(day).diff(dayjs(entries[i][0]), "day")) > 1) {
        break;
      }
      day = dayjs(entries[i][0]);
      const totalProtein = entries[i][1].reduce((sum, e) => sum + e.grams, 0);

      if (dayjs(targets[targetIndex][0]).isAfter(day)) {
        targetIndex = targets.findLastIndex(([d]) =>
          dayjs(d).subtract(1, "day").isBefore(day),
        );
      }

      if (targetIndex === -1) {
        break;
      }

      const target = targets[targetIndex][1];

      if (totalProtein >= target) {
        streak++;
      }
      // Don't count streak as broken if todays' target wasn't met yet
      else if (dayjs(day).isSame(dayjs(), "day")) {
        continue;
      } else {
        break;
      }
    }
    return streak;
  },
);

export {
  selectMonthlyDailyAverage,
  selectDailyProteinTarget,
  selectTotalProteinForDay,
  selectDailyAvg,
  selectStreak,
  selectDailyTargetResults,
  selectDaysEntries,
};
