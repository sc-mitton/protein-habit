import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  Appearance,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

import { Text, Box } from "@components";
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
import { HomeStackParamList } from "@types";
import CalendarCell from "./CalendarCell";

const CALENDAR_WIDTH = Dimensions.get("window").width;
// the window width minus the calendar width
const CALENDAR_NEGATIVE_SPACE = Dimensions.get("window").width - CALENDAR_WIDTH;
const CALENDAR_PADDING = 12;

const Calendar = () => {
  const accent = useAppSelector(selectAccent);
  const userInception = useAppSelector(selectUserInception);
  const calendarRef = useRef<FlatList>(null);
  const calendarData = useMemo(
    () => generateCalendarData(userInception),
    [userInception],
  );
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const isInModal = navigation.getState().routes.length > 1;
  const [currentIndex, setCurrentIndex] = useState(calendarData.length - 1);
  const proteinMonthlyDailyAverage = useAppSelector((state) =>
    selectMonthlyDailyAverage(state, calendarData[currentIndex][0]),
  );
  useEffect(() => {
    setTimeout(() => {
      calendarRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, [calendarData]);
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
    <Box
      justifyContent="center"
      alignItems="center"
      zIndex={100}
      height={isInModal ? 300 : "auto"}
      {...(!isInModal && { flex: 1 })}
      width={"100%"}
    >
      <FlatList
        style={styles.flatList}
        data={calendarData}
        nestedScrollEnabled={true}
        keyExtractor={(item) => item[0]}
        hitSlop={{ top: -64 }}
        horizontal
        pagingEnabled
        onScroll={({ nativeEvent }) => {
          setCurrentIndex(
            Math.abs(Math.round(nativeEvent.contentOffset.x / CALENDAR_WIDTH)),
          );
        }}
        ref={calendarRef}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
        scrollEventThrottle={16}
        snapToOffsets={calendarData.map((_, index) => {
          return index * CALENDAR_WIDTH;
        })}
        decelerationRate={0.01}
        renderItem={({ item, index }) => (
          <Box
            key={`scroll-container-${index}`}
            style={[
              styles.scrollContainer,
              index == 0 && styles.firstScrollContainer,
              index === calendarData.length - 1 && styles.lastScrollContainer,
            ]}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingRight="l"
              marginLeft="l"
              paddingLeft="xxs"
              gap="s"
            >
              <Text accent={true} variant={isInModal ? "bold" : undefined}>
                {dayjs(item[0], "MMM DD, YYYY").format("MMM YYYY")}
              </Text>
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
              {item[1].map((days: number[], rowIndex: number) => {
                return (
                  <View
                    style={[styles.row, { zIndex: rowIndex }]}
                    key={`row-${rowIndex}`}
                  >
                    {days.map((day, columnIndex) => {
                      const isBookend =
                        Math.abs(rowIndex - Math.floor(day / 7)) > 1;

                      const dayInJS = dayjs(item[0], "MMM DD, YYYY").date(day);

                      const targetMet =
                        dayInJS.isAfter(
                          dayjs(userInception).subtract(1, "day"),
                          "day",
                        ) && dayInJS.isBefore(dayjs().add(1, "day"), "day")
                          ? mappedDailyTargetResults[
                              dayInJS.format(dayFormat)
                            ]?.[2] || false
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
          </Box>
        )}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  scrollContainer: {
    marginTop: 16,
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
  },
  lastScrollContainer: {
    paddingRight: CALENDAR_NEGATIVE_SPACE / 2,
  },
  firstScrollContainer: {
    paddingLeft: CALENDAR_NEGATIVE_SPACE / 2,
  },
  monthContainer: {
    width: CALENDAR_WIDTH,
    paddingTop: 16,
    paddingHorizontal: CALENDAR_PADDING,
  },
  row: {
    flexDirection: "row",
    marginLeft: 12,
    marginRight: 12,
  },
  cell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: Platform.OS === "ios" ? 3 : 4,
    paddingBottom: Platform.OS === "ios" ? 3 : 4,
  },
});

export default memo(Calendar);
