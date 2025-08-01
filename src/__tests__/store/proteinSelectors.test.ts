import dayjs from "dayjs";
import { dayFormat, timeFormat } from "@constants/formats";

import {
  selectTotalProteinForDay,
  selectDailyAvg,
  selectStreak,
  selectDailyTargetResults,
  selectDaysEntries,
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

describe("select the weekly average", () => {
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
    user: {
      ...userInitialState,
      name: "John Doe",
      inceptionDate: dayjs().subtract(100, "day").format(dayFormat),
    },
  };

  it("should select the weekly average when user inception is before the start", () => {
    for (let i = 0; i < 7; i++) {
      jest.setSystemTime(dayjs(rootDate).subtract(i, "day").toDate());
      const start = dayjs().startOf("week").format(dayFormat);
      const expected = i === 0 ? 0 : 100;
      expect(selectDailyAvg(state as any, start)).toBe(expected);
    }

    jest.useRealTimers();
  });

  it("should select the weekly average when user inception is after the start", () => {
    const expected = 69;
    state.user.inceptionDate = dayjs(rootDate)
      .subtract(1, "day")
      .format(dayFormat);

    state.protein.entries[1] = [
      dayjs(rootDate).subtract(1, "day").format(dayFormat),
      [
        {
          grams: expected,
          id: "1",
          time: dayjs(rootDate).subtract(1, "day").format(timeFormat),
        },
      ],
    ];

    jest.setSystemTime(dayjs(rootDate).toDate());

    expect(
      selectDailyAvg.resultFunc(
        state.protein.entries,
        state.user,
        dayjs(rootDate).subtract(1, "day").format(dayFormat),
      ),
    ).toBe(expected);

    jest.useRealTimers();
  });
});

describe("selectStreak", () => {
  const expected = 5;
  // prettier-ignore
  const state = {
    protein: {
      ...initialState,
      entries: [
        [dayjs().subtract(6, "day").format(dayFormat), [{grams: 75}, {grams: 75}, {grams: 75}]],
        [dayjs().subtract(5, "day").format(dayFormat), [{grams: 30}, {grams: 10}, {grams: 20}]],
        [dayjs().subtract(4, "day").format(dayFormat), [{grams: 105}, {grams: 50}, {grams: 50}]],
        [dayjs().subtract(3, "day").format(dayFormat), [{grams: 50}, {grams: 50}, {grams: 50}]],
        [dayjs().subtract(2, "day").format(dayFormat), [{grams: 50}, {grams: 50}, {grams: 50}]],
        [dayjs().subtract(1, "day").format(dayFormat), [{grams: 50}, {grams: 50}, {grams: 50}]],
        [dayjs().format(dayFormat), [{grams: 50}, {grams: 50}, {grams: 50}]],
      ],
      dailyTargets: [
        [dayjs().subtract(6, "day").format(dayFormat), 130],
        [dayjs().subtract(2, "day").format(dayFormat), 135],
        [dayjs().subtract(1, "day").format(dayFormat), 150]
      ]
    } as ProteinState,
    weight: {
      value: 200,
      unit: "lbs" as const,
    },
  };

  it("should select the number of days the users goal was met", () => {
    expect(
      selectStreak.resultFunc(
        state.protein.entries,
        state.protein.dailyTargets,
        state.weight,
      ),
    ).toEqual(expected);
  });

  it("should decrease streak when today has no entries", () => {
    state.protein.entries[state.protein.entries.length - 1][1] = [];
    expect(
      selectStreak.resultFunc(
        state.protein.entries,
        state.protein.dailyTargets,
        state.weight,
      ),
    ).toEqual(expected - 1);
  });

  it("should have no streak when no entries for the past day before streak", () => {
    jest.useFakeTimers();
    jest.setSystemTime(
      dayjs(state.protein.entries[state.protein.entries.length - 1][0])
        .add(2, "day")
        .toDate(),
    );
    expect(
      selectStreak.resultFunc(
        state.protein.entries,
        state.protein.dailyTargets,
        state.weight,
      ),
    ).toEqual(0);

    jest.useRealTimers();
  });

  it("should have a smaller streak than expected if there's a gap with no entries", () => {
    state.protein.entries.splice(state.protein.entries.length - 3, 1);
    expect(
      selectStreak.resultFunc(
        state.protein.entries,
        state.protein.dailyTargets,
        state.weight,
      ),
    ).toEqual(1);
  });
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

  expect(selectDaysEntries(state as any, dayjs().format(dayFormat))).toEqual([
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

  const mockedToday = "2025-01-05";
  jest.useFakeTimers();
  jest.setSystemTime(dayjs(mockedToday).toDate());

  // prettier-ignore
  const tests = [
    {
      entries:[
        [
          dayjs().subtract(4, "day").format(dayFormat),
          [{ grams: 50 }, { grams: 50 }, { grams: 50 }],
        ],
        [
          dayjs().subtract(3, "day").format(dayFormat),
          [{ grams: 50 }, { grams: 50 }, { grams: 50 }],
        ],
      ],
      targets:[
        [dayjs().subtract(5, "day").format(dayFormat), calculateTarget],
        [dayjs().subtract(3, "day").format(dayFormat), 135],
        [dayjs().subtract(2, "day").format(dayFormat), 150],
      ],
      selected: [
        [dayjs().subtract(5, "day").format(dayFormat), 0, false, calculateTarget],
        [dayjs().subtract(4, "day").format(dayFormat), 150, true, calculateTarget],
        [dayjs().subtract(3, "day").format(dayFormat), 150, true, 135],
        [dayjs().subtract(2, "day").format(dayFormat), 0, false, 150],
        [dayjs().subtract(1, "day").format(dayFormat), 0, false, 150],
      ],
      start: dayjs().subtract(5, "day").format(dayFormat),
    },
    {
      entries:[[dayjs().format(dayFormat), []]],
      targets: [[dayjs().format(dayFormat), null]],
      selected: [],
      start: dayjs().format(dayFormat),
    },
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

  jest.useRealTimers();
});
