import dayjs from "dayjs";
import { dayFormat, timeFormat } from "@constants/formats";

import {
  selectTotalProteinForDay,
  selectMonthlyDailyAverage,
  selectDailyAvg,
  selectStreak,
  selectDailyTargetResults,
  selectTodaysEntries,
} from "@store/slices/proteinSelectors";
import { initialState, getRecommendedTarget } from "@store/slices/proteinSlice";
import type { ProteinState } from "@store/slices/proteinSlice";
import { initialState as userInitialState } from "@store/slices/userSlice";

it("should select the total amount of protein for day", () => {
  const state = {
    protein: {
      ...initialState,
      entries: [
        [
          dayjs().format(dayFormat),
          [
            {
              id: "1",
              grams: 100,
              time: dayjs().format(timeFormat),
            },
            {
              id: "2",
              grams: 200,
              time: dayjs().format(timeFormat),
            },
          ],
        ],
      ],
    },
  };

  expect(
    selectTotalProteinForDay(state as any, dayjs().format(dayFormat)),
  ).toBe(300);
});

it("should select the monthly daily average", () => {
  const state = {
    protein: {
      ...initialState,
      entries: Array.from({
        length: dayjs().add(1, "month").daysInMonth(),
      }).map((_, index) => [
        dayjs()
          .subtract(1, "month")
          .startOf("month")
          .add(index, "day")
          .format(dayFormat),
        Array.from({ length: 10 }).map((_, i) => ({
          id: Math.random().toString(36).slice(0, 9),
          grams: 10,
          time: dayjs().subtract(index, "day").format(timeFormat),
        })),
      ]),
    } as ProteinState,
    user: {
      ...userInitialState,
      name: "John Doe",
      inceptionDate: dayjs().subtract(100, "day").format(dayFormat),
      weight: {
        value: 100,
        unit: "lbs",
      },
    },
  };

  expect(
    selectMonthlyDailyAverage(
      state as any,
      dayjs().startOf("month").subtract(1, "month").format(dayFormat),
    ).avgProteinPerDay,
  ).toBe(100);
});

it("should select the weekly average", () => {
  const rootDate = "2025-01-05";
  jest.useFakeTimers();

  const state = {
    protein: {
      ...initialState,
      entries: Array.from({
        length: 12,
      }).map((_, index) => [
        dayjs(rootDate).subtract(index, "day").format(dayFormat),
        Array.from({ length: 10 }).map((_, i) => ({
          id: Math.random().toString(36).slice(0, 9),
          grams: 10,
          time: dayjs().subtract(index, "day").format(timeFormat),
        })),
      ]),
    } as ProteinState,
  };

  for (let i = 0; i < 7; i++) {
    jest.setSystemTime(dayjs(rootDate).subtract(i, "day").toDate());
    const start = dayjs().startOf("week").format(dayFormat);
    const expected = i === 0 ? 0 : 100;
    expect(selectDailyAvg(state as any, start)).toBe(expected);
  }

  jest.useRealTimers();
});

it("should select the number of days the users goal was met", () => {
  const expected = 4;
  // prettier-ignore
  const state = {
    protein: {
      ...initialState,
      entries: [
        [dayjs().format(dayFormat), [{grams: 50}, {grams: 50}, {grams: 50}]],
        [dayjs().subtract(1, "day").format(dayFormat), [{grams: 50}, {grams: 50}, {grams: 50}]],
        [dayjs().subtract(2, "day").format(dayFormat), [{grams: 50}, {grams: 50}, {grams: 50}]],
        [dayjs().subtract(3, "day").format(dayFormat), [{grams: 50}, {grams: 50}, {grams: 50}]],
        [dayjs().subtract(4, "day").format(dayFormat), [{grams: 105}, {grams: 50}, {grams: 50}]],
        [dayjs().subtract(5, "day").format(dayFormat), [{grams: 30}, {grams: 10}, {grams: 20}]],
        [dayjs().subtract(6, "day").format(dayFormat), [{grams: 75}, {grams: 75}, {grams: 75}]],
      ],
      dailyTargets: [
        [dayjs().subtract(1, "day").format(dayFormat), 150],
        [dayjs().subtract(2, "day").format(dayFormat), 135],
      ]
    } as ProteinState,
    user: {
      ...userInitialState,
      name: "John Doe",
      weight: {
        value: 200,
        unit: "lbs",
      },
    },
  };

  expect(selectStreak(state as any)).toEqual(expected);
});

it("should select the todays entries", () => {
  const state = {
    protein: {
      ...initialState,
      entries: [
        [
          dayjs().format(dayFormat),
          [{ grams: 50 }, { grams: 50 }, { grams: 50 }],
        ],
      ],
    },
  };

  expect(selectTodaysEntries(state as any)).toEqual([
    { grams: 50 },
    { grams: 50 },
    { grams: 50 },
  ]);
});

it("should select the daily target results", () => {
  const user = {
    ...userInitialState,
    name: "John Doe",
    weight: {
      value: 200,
      unit: "lbs",
    } as const,
  };
  const calculateTarget = getRecommendedTarget(
    user.weight.value,
    user.weight.unit,
  );

  // prettier-ignore
  const tests = [
    {
      entries:[
        [
          dayjs().subtract(3, "day").format(dayFormat),
          [{ grams: 50 }, { grams: 50 }, { grams: 50 }],
        ],
        [
          dayjs().subtract(4, "day").format(dayFormat),
          [{ grams: 50 }, { grams: 50 }, { grams: 50 }],
        ],
      ],
      targets:[
        [dayjs().subtract(2, "day").format(dayFormat), 150],
        [dayjs().subtract(3, "day").format(dayFormat), 135],
      ],
      selected: [
        [dayjs().subtract(1, "day").format(dayFormat), 0, false, 150],
        [dayjs().subtract(2, "day").format(dayFormat), 0, false, 150],
        [dayjs().subtract(3, "day").format(dayFormat), 150, true, 135],
        [dayjs().subtract(4, "day").format(dayFormat), 150, true, calculateTarget],
        [dayjs().subtract(5, "day").format(dayFormat), 0, false, calculateTarget],
      ],
      start: dayjs().subtract(5, "day").format(dayFormat),
    },
    {
      entries:[[dayjs().format(dayFormat), []]],
      targets: [[dayjs().format(dayFormat), null]],
      selected: [],
      start: dayjs().format(dayFormat),
    },
    {
      entries:[[dayjs().format(dayFormat), []]],
      targets: [[dayjs().subtract(10, 'day').format(dayFormat), null]],
      selected: Array.from({length: 10}).map((_, i) =>
        [dayjs().subtract(i + 1, 'day').format(dayFormat), 0, false, calculateTarget]),
      start: dayjs().subtract(10, "day").format(dayFormat),
    }
  ]

  for (const test of tests) {
    const state = {
      protein: {
        ...initialState,
        entries: test.entries,
        dailyTargets: test.targets,
      },
      user,
    };

    expect(selectDailyTargetResults(state as any, test.start)).toEqual(
      test.selected,
    );
  }
});
