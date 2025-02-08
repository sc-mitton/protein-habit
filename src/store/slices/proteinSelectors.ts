import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import Big from "big.js";

import { RootState } from "..";
import { dayFormat } from "@constants/formats";
import { getRecommendedTarget } from "./proteinSlice";

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

// Returns the average protein intake per day for a given month
const selectMonthlyDailyAverage = createSelector(
  [
    (state: RootState) => state.protein.entries,
    (state: RootState) => state.user,
    (_: RootState, month: string) => month,
  ],
  (entries, user, month) => {
    const date = dayjs(month, "YYYY-MM");

    const monthEntries = entries.filter(([day]) => {
      return (
        dayjs(day).isSame(date, "month") && dayjs(day).isBefore(dayjs(), "day")
      );
    });

    const totalProtein = monthEntries.reduce(
      (sum, [, dayEntries]) =>
        sum + dayEntries.reduce((daySum, entry) => daySum + entry.grams, 0),
      0,
    );

    const daysWithEntries = monthEntries.length;

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
          date.startOf("month").diff(dayjs(), "day"),
          date.daysInMonth(),
        ),
      ),
    );

    console.log("denominator: ", denominator);
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
    const startDayjs =
      user?.inceptionDate && dayjs(start).isBefore(user.inceptionDate)
        ? dayjs(user.inceptionDate)
        : dayjs(start);

    const numDays = dayjs().diff(startDayjs, "day");

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

    // round reult to 1 decimal place
    return Math.round(result * 10) / 10;
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

    const daysSinceLastEntry = dayjs().diff(dayjs(entries[0][0]), "day") - 1;
    const target =
      targets[0][1] ?? getRecommendedTarget(weight.value, weight.unit);

    // Fill in start
    for (let i = 1; i < daysSinceLastEntry + 1; i++) {
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
        dayjs(results[results.length - 1]?.[0]).diff(
          dayjs(entries[i][0]),
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
    let lastDay = dayjs(results[results.length - 1]?.[0]) || dayjs();
    const gap = lastDay.diff(dayjs(start), "day");
    for (let i = 1; i <= gap; i++) {
      const day = dayjs(lastDay).subtract(1, "day");
      const target =
        targets.find(([d]) => {
          return dayjs(d).subtract(1, "day").isBefore(day);
        })?.[1] ?? getRecommendedTarget(weight.value, weight.unit);

      results.push([day.format(dayFormat), 0, false, target]);
      lastDay = day;
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
      const totalProtein = entries[i][1].reduce((sum, e) => sum + e.grams, 0);
      const target =
        targets.find(([day]) =>
          dayjs(day).isBefore(dayjs(entries[i][0])),
        )?.[1] ?? defaultTarget;
      if (totalProtein >= target) {
        streak++;
      } else if (i !== 0) {
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
  selectTodaysEntries,
};
