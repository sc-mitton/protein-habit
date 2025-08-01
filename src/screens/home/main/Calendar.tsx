import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { ChevronDown } from "geist-native-icons";

import { Text, Box, Icon, MonthPicker } from "@components";
import dayjs from "dayjs";
import { useAppSelector } from "@store/hooks";
import {
  selectMonthlyDailyAverage,
  selectDailyTargetResults,
} from "@store/slices/proteinSelectors";
import { selectUserInception } from "@store/slices/userSlice";
import { dayFormat } from "@constants/formats";
import { generateCalendarData } from "./helpers";
import { selectAccent } from "@store/slices/uiSlice";
import CalendarCell from "./CalendarCell";

const Month = (item: any) => {
  const userInception = useAppSelector(selectUserInception);
  const dailyTargetResults = useAppSelector((state) =>
    selectDailyTargetResults(
      state,
      userInception
        ? dayjs(userInception).format(dayFormat)
        : dayjs().startOf("month").subtract(1, "month").format(dayFormat),
    ),
  );

  // Map the daily target results so the key is the date (index 0 of each sub-array)
  const mappedDailyTargetResults = useMemo(() => {
    return dailyTargetResults.reduce(
      (acc, curr) => {
        acc[curr[0]] = curr;
        return acc;
      },
      {} as Record<string, [string, number, boolean, number]>,
    );
  }, [dailyTargetResults]);

  return (
    <Box style={styles.monthContainer} key={item[0]}>
      <Box style={styles.row}>
        {Array.from({ length: 7 }).map((_, columnIndex) => {
          return (
            <Box style={styles.cell} key={`header-${columnIndex}`}>
              <Text fontSize={10} variant="bold">
                {dayjs().day(columnIndex).format("dd")[0]}
              </Text>
            </Box>
          );
        })}
      </Box>
      {item.item?.[1]?.map((days: number[], rowIndex: number) => {
        return (
          <View
            style={[styles.row, { zIndex: rowIndex }]}
            key={`row-${rowIndex}`}
          >
            {days.map((day, columnIndex) => {
              const isBookend = Math.abs(rowIndex - Math.floor(day / 7)) > 1;

              const dayInJS = dayjs(item[0], "MMM DD, YYYY").date(day);

              const targetMet =
                dayInJS.isAfter(
                  dayjs(userInception).subtract(1, "day"),
                  "day",
                ) && dayInJS.isBefore(dayjs().add(1, "day"), "day")
                  ? mappedDailyTargetResults[dayInJS.format(dayFormat)]?.[2] ||
                    false
                  : null;

              const targetResult =
                mappedDailyTargetResults[dayInJS.format(dayFormat)];
              const tipLabel = targetResult
                ? `Total: ${targetResult[1]}g  \nTarget: ${targetResult[3]}g`
                : undefined;

              return (
                <CalendarCell
                  key={`row-${rowIndex}-${columnIndex}`}
                  dayInJS={dayInJS}
                  columnIndex={columnIndex}
                  rowIndex={rowIndex}
                  isBookend={isBookend}
                  targetMet={targetMet}
                  tipLabel={tipLabel}
                />
              );
            })}
          </View>
        );
      })}
    </Box>
  );
};

const Calendar = () => {
  const userInception = useAppSelector(selectUserInception);
  const calendarRef = useRef<FlatList>(null);
  const calendarData = useMemo(
    () => generateCalendarData(userInception),
    [userInception],
  );
  const [selectedMonth, setSelectedMonth] = useState(
    calendarData[calendarData.length - 1],
  );
  const accent = useAppSelector(selectAccent);
  const proteinMonthlyDailyAverage = useAppSelector((state) =>
    selectMonthlyDailyAverage(state, selectedMonth[0]),
  );
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      calendarRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, [calendarData]);

  return (
    <Box
      variant="homeTabSection"
      borderRadius="l"
      paddingBottom="m"
      justifyContent="center"
      alignItems="center"
      zIndex={100}
      style={styles.container}
    >
      <Box width="100%">
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap="s"
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setMonthPickerVisible(true)}
          >
            <Box flexDirection="row" alignItems="center" gap="s">
              <Text accent={true}>
                {dayjs(selectedMonth[0], "MMM DD, YYYY").format("MMM YYYY")}
              </Text>
              <Icon
                icon={ChevronDown}
                size={18}
                color={accent}
                strokeWidth={2.5}
              />
            </Box>
          </TouchableOpacity>
          <Box
            paddingHorizontal="s"
            paddingVertical="xs"
            borderRadius="s"
            overflow="hidden"
          >
            <Box
              backgroundColor={accent}
              opacity={0.1}
              style={StyleSheet.absoluteFill}
            />
            <Text
              color="primaryText"
              accent={true}
              fontSize={12}
              lineHeight={16}
              variant="bold"
            >
              {`${proteinMonthlyDailyAverage.avgProteinPerDay}g / day`}
            </Text>
          </Box>
        </Box>
      </Box>
      <Month item={selectedMonth} />
      <MonthPicker
        visible={monthPickerVisible}
        setVisible={setMonthPickerVisible}
        value={selectedMonth[0]}
        onChange={(value) => {
          const newSelected = calendarData.find((item) => item[0] === value);
          if (newSelected) {
            setSelectedMonth(newSelected);
          }
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  monthContainer: {
    paddingTop: 16,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: Platform.OS === "ios" ? 3 : 4,
    paddingBottom: Platform.OS === "ios" ? 3 : 4,
  },
  container: {
    marginBottom: 120,
  },
});

export default memo(Calendar);
