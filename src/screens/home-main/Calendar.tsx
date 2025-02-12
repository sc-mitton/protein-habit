import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Platform,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { Check, X, BarChart2 } from "geist-native-icons";

import { Text, Box, Icon, Tip } from "@components";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "@store/hooks";
import {
  selectMonthlyDailyAverage,
  selectDailyTargetResults,
} from "@store/slices/proteinSelectors";
import { selectUserInception } from "@store/slices/userSlice";
import { dayFormat } from "@constants/formats";
import { generateCalendarData } from "./helpers";
import CalendarTip from "./Tips";
const CALENDAR_WIDTH = Dimensions.get("window").width * 0.7;
// the window width minus the calendar width
const CALENDAR_NEGATIVE_SPACE = Dimensions.get("window").width - CALENDAR_WIDTH;
const CALENDAR_PADDING = 12;

const Calendar = () => {
  const userInception = useAppSelector(selectUserInception);
  const calendarRef = useRef<FlatList>(null);
  const calendarData = useMemo(
    () => generateCalendarData(userInception),
    [userInception],
  );
  const [currentIndex, setCurrentIndex] = useState(calendarData.length - 1);
  const [focusedCell, setFocusedCell] = useState<Dayjs>();
  const proteinMonthlyDailyAverage = useAppSelector((state) =>
    selectMonthlyDailyAverage(state, calendarData[currentIndex][0]),
  );
  const theme = useTheme();
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
      elevation={8}
      height={300}
      justifyContent="center"
      backgroundColor="mainBackground"
    >
      <Box
        style={styles.innerBox}
        shadowColor="borderColor"
        shadowOffset={{ width: 0, height: -1 }}
        shadowOpacity={0.7}
        shadowRadius={1}
        elevation={12}
        backgroundColor="mainBackground"
      >
        <View style={styles.calendarContainer}>
          <FlatList
            data={calendarData}
            style={styles.flatList}
            keyExtractor={(item) => item[0]}
            hitSlop={{ top: -64 }}
            horizontal
            pagingEnabled
            onScroll={({ nativeEvent }) => {
              setCurrentIndex(
                Math.abs(
                  Math.round(nativeEvent.contentOffset.x / CALENDAR_WIDTH),
                ),
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
              <View
                key={`scroll-container-${index}`}
                style={[
                  styles.scrollContainer,
                  index == 0 && styles.firstScrollContainer,
                  index === calendarData.length - 1 &&
                    styles.lastScrollContainer,
                ]}
              >
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text variant="bold" style={styles.monthHeader}>
                    {dayjs(item[0], "MMM DD, YYYY").format("MMM YYYY")}
                  </Text>

                  <Box
                    marginBottom="s"
                    backgroundColor="primaryButton"
                    borderRadius="s"
                    marginRight="ml"
                  >
                    <Tip
                      label={`Averaged ${proteinMonthlyDailyAverage.avgProteinPerDay}g / day`}
                    >
                      <Box margin="xs">
                        <Icon icon={BarChart2} size={16} strokeWidth={2} />
                      </Box>
                    </Tip>
                  </Box>
                </Box>
                <View style={styles.monthContainer} key={item[0]}>
                  {item[1].map((days: number[], columnIndex: number) => {
                    return (
                      <View style={styles.column} key={`column-${columnIndex}`}>
                        <View style={styles.cell}>
                          <Text variant="bold" fontSize={14}>
                            {dayjs().day(columnIndex).format("dd")[0]}
                          </Text>
                        </View>
                        {days.map((day, rowIndex) => {
                          const isBookend =
                            Math.abs(rowIndex - Math.floor(day / 7)) > 1;

                          const dayInJS = dayjs(item[0], "MMM DD, YYYY").date(
                            day,
                          );

                          const targetMet =
                            dayInJS.isAfter(dayjs(userInception), "day") &&
                            dayInJS.isBefore(dayjs().add(1, "day"), "day")
                              ? mappedDailyTargetResults[
                                  dayInJS.format(dayFormat)
                                ]?.[2] || false
                              : null;

                          return (
                            <TouchableHighlight
                              style={[
                                styles.cellContainer,
                                {
                                  zIndex:
                                    focusedCell &&
                                    focusedCell.isSame(
                                      dayjs(item[0]).date(day),
                                      "day",
                                    )
                                      ? 100
                                      : 7 - rowIndex,
                                },
                              ]}
                              disabled={isBookend || targetMet === null}
                              activeOpacity={targetMet === undefined ? 1 : 0.97}
                              underlayColor={theme.colors.primaryText}
                              onPressOut={() => {
                                if (focusedCell) {
                                  setFocusedCell(undefined);
                                } else {
                                  setFocusedCell(dayjs(item[0]).date(day));
                                }
                              }}
                              key={`cell-${columnIndex}-${rowIndex}`}
                            >
                              <>
                                {focusedCell?.isSame(
                                  dayjs(item[0]).date(day),
                                  "day",
                                ) &&
                                  !isBookend && (
                                    <CalendarTip
                                      targetResult={
                                        mappedDailyTargetResults[
                                          dayInJS.format(dayFormat)
                                        ]
                                      }
                                      onOutsidePress={() =>
                                        setFocusedCell(undefined)
                                      }
                                    />
                                  )}
                                <Box
                                  borderRadius="m"
                                  style={styles.cell}
                                  backgroundColor="mainBackground"
                                >
                                  <Text
                                    color={
                                      isBookend ? "tertiaryText" : "primaryText"
                                    }
                                    lineHeight={24}
                                    fontSize={12}
                                  >
                                    {day}
                                  </Text>
                                  <View style={styles.belowIconContainer}>
                                    <View style={styles.belowIcon}>
                                      {targetMet && !isBookend && (
                                        <Icon
                                          icon={Check}
                                          size={10}
                                          color={"primaryText"}
                                          strokeWidth={4}
                                        />
                                      )}
                                      {targetMet === false &&
                                        !isBookend &&
                                        !dayInJS.isSame(dayjs(), "day") && (
                                          <Icon
                                            icon={X}
                                            size={12}
                                            color={"error"}
                                            strokeWidth={3}
                                          />
                                        )}
                                    </View>
                                  </View>
                                </Box>
                              </>
                            </TouchableHighlight>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          />
        </View>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  innerBox: {
    flex: 1,
    paddingTop: 28,
  },
  calendarContainer: {
    alignItems: "flex-start",
  },
  flatList: {
    paddingVertical: 64,
    marginVertical: -78,
  },
  slotNumbers: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  scrollContainer: {
    marginTop: 8,
    flexDirection: "column",
  },
  lastScrollContainer: {
    paddingRight: CALENDAR_NEGATIVE_SPACE / 2,
  },
  firstScrollContainer: {
    paddingLeft: CALENDAR_NEGATIVE_SPACE / 2,
  },
  monthHeader: {
    paddingHorizontal: CALENDAR_PADDING + 12,
    marginBottom: 8,
  },
  monthContainer: {
    flexDirection: "row",
    width: CALENDAR_WIDTH,
    paddingHorizontal: CALENDAR_PADDING,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  cellContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  cell: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    padding: Platform.OS === "ios" ? 3 : 4,
  },
  belowIconContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  belowIcon: {
    transform: [{ translateX: 3 }],
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(Calendar);
