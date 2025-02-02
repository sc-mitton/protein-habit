import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import Animated, {
  SlideInDown,
  FadeOut,
  Easing,
} from "react-native-reanimated";
import SlotNumbers from "react-native-slot-numbers";
import { useTheme } from "@shopify/restyle";
import { Check, X } from "geist-native-icons";
import OutsidePressHandler from "react-native-outside-press";

import { Text, Box, Icon } from "@components";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "@store/hooks";
import {
  selectAggregates,
  selectDailyTargetResults,
} from "@store/slices/proteinSlice";
import { selectUserInception } from "@store/slices/userSlice";
import { dayFormat } from "@constants/formats";

const CALENDAR_WIDTH = Dimensions.get("window").width * 0.7;
// the window width minus the calendar width
const CALENDAR_NEGATIVE_SPACE = Dimensions.get("window").width - CALENDAR_WIDTH;
const CALENDAR_PADDING = 12;

// Function to generate calendar data
const generateCalendarData = (userInception: string) => {
  const numMonths = Math.max(2, dayjs().diff(dayjs(userInception), "month"));
  const data = [] as Array<[string, number[][]]>;

  for (let i = 0; i < numMonths; i++) {
    const month = dayjs().subtract(i, "month");

    const daysInMonth = month.daysInMonth();
    const sparePreviousDays = month.startOf("month").day();
    const spareNextDays = 7 - month.endOf("month").day() - 1;
    const previousDaysInMonth = month.subtract(1, "month").daysInMonth();

    // prettier-ignore
    const days = Array.from({ length: daysInMonth })
      .map((_, i) => i + 1)
      .reduce((acc, day, i) => {
        // Add bookstart
        if (i === 0) {
          for (let j = 0; j < sparePreviousDays; j++) {
            const day = previousDaysInMonth - sparePreviousDays + j + 1;
            acc[j % 7].push(day);
          }
        }
        // Add day
        const columnIndex = (i + sparePreviousDays) % 7;
        acc[columnIndex].push(day);

        // Add bookend
        if (day === daysInMonth) {
          for (let k = 1; k <= spareNextDays; k++) {
            const columnIndex =(i + sparePreviousDays + k) % 7;
            acc[columnIndex].push(k);
          }
        }
        if (acc[acc.length - 1].length === 5 && day === daysInMonth) {
            for (let k = 0; k < 7; k++) {
                acc[k].push(k + spareNextDays + 1);
            }
        }
        return acc;
      }, [...Array.from({ length: 7 }).map(() => [] as number[])]);

    data.push([month.startOf("month").format(dayFormat), days]);
  }

  return data.reverse();
};

const Calendar = () => {
  const userInception = useAppSelector(selectUserInception);
  const calendarRef = useRef<FlatList>(null);
  const calendarData = useMemo(
    () => generateCalendarData(userInception),
    [userInception],
  );
  const [currentIndex, setCurrentIndex] = useState(calendarData.length - 1);
  const [focusedCell, setFocusedCell] = useState<Dayjs>();
  const proteinAggregates = useAppSelector((state) =>
    selectAggregates(state, calendarData[currentIndex][0]),
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

  return (
    <Box
      shadowColor="mainBackground"
      shadowOffset={{ width: 0, height: 24 }}
      shadowOpacity={1}
      shadowRadius={24}
      elevation={8}
      backgroundColor="secondaryBackground"
      flex={4}
    >
      <Box
        style={styles.innerBox}
        paddingVertical="l"
        shadowColor="primaryText"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.05}
        shadowRadius={3.84}
        elevation={5}
        backgroundColor="secondaryBackground"
      >
        <OutsidePressHandler
          onOutsidePress={() => {
            setFocusedCell(undefined);
          }}
        >
          <View style={styles.calendarContainer}>
            <FlatList
              data={calendarData}
              keyExtractor={(item) => item[0]}
              horizontal
              pagingEnabled
              onViewableItemsChanged={({ viewableItems }) => {
                if (viewableItems.length === 3) {
                  setCurrentIndex(viewableItems[1].index ?? 0);
                } else {
                  if (viewableItems[0].index === 0) {
                    setCurrentIndex(viewableItems[0].index ?? 0);
                  } else {
                    setCurrentIndex(calendarData.length - 1);
                  }
                }
              }}
              ref={calendarRef}
              showsHorizontalScrollIndicator={false}
              onScrollToIndexFailed={() => {}}
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
                  <Text variant="bold" style={styles.monthHeader}>
                    {dayjs(item[0], "MMM DD, YYYY").format("MMM YYYY")}
                  </Text>
                  <View style={styles.monthContainer} key={item[0]}>
                    {item[1].map((days: number[], columnIndex: number) => {
                      return (
                        <View
                          style={styles.column}
                          key={`column-${columnIndex}`}
                        >
                          <View style={styles.cell}>
                            <Text
                              color="secondaryText"
                              variant="bold"
                              fontSize={14}
                            >
                              {dayjs().day(columnIndex).format("dd")[0]}
                            </Text>
                          </View>
                          {days.map((day, rowIndex) => {
                            const isBookend =
                              Math.abs(rowIndex - Math.floor(day / 7)) > 1;

                            const targetMet = isBookend
                              ? undefined
                              : dailyTargetResults[
                                  dayjs().diff(
                                    dayjs(item[0]).date(day),
                                    "day",
                                  ) - 1
                                ]?.[2];

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
                                activeOpacity={
                                  targetMet === undefined ? 1 : 0.97
                                }
                                underlayColor={theme.colors.primaryText}
                                onPressOut={() => {
                                  if (targetMet !== undefined) {
                                    setFocusedCell(dayjs(item[0]).date(day));
                                  } else {
                                    setFocusedCell(undefined);
                                  }
                                }}
                                key={`cell-${columnIndex}-${rowIndex}`}
                              >
                                <Box
                                  borderRadius="m"
                                  style={styles.cell}
                                  backgroundColor="secondaryBackground"
                                >
                                  <Text
                                    color={
                                      isBookend
                                        ? "quaternaryText"
                                        : "primaryText"
                                    }
                                    variant="body"
                                    fontSize={12}
                                  >
                                    {day}
                                  </Text>
                                  {focusedCell?.isSame(
                                    dayjs(item[0]).date(day),
                                    "day",
                                  ) &&
                                    !isBookend && (
                                      <Animated.View
                                        style={styles.aboveTipContainer}
                                        entering={SlideInDown.withInitialValues(
                                          {
                                            originY: 1,
                                            opacity: 0,
                                          },
                                        ).easing(
                                          Easing.bezier(
                                            0.25,
                                            0.1,
                                            0.25,
                                            1.0,
                                          ).factory(),
                                        )}
                                        exiting={FadeOut.duration(200)}
                                      >
                                        <Box
                                          backgroundColor="cardBackground"
                                          borderRadius="m"
                                          shadowColor="tipShadow"
                                          shadowOffset={{ width: 0, height: 2 }}
                                          shadowOpacity={1}
                                          shadowRadius={12}
                                          style={styles.aboveTip}
                                        >
                                          <Box
                                            marginHorizontal="s"
                                            marginVertical="xs"
                                            flexDirection="row"
                                            flexWrap="nowrap"
                                          >
                                            <Text variant="body" fontSize={14}>
                                              Total:&nbsp;
                                              {
                                                dailyTargetResults[
                                                  dayjs().diff(
                                                    dayjs(item[0]).date(day),
                                                    "day",
                                                  ) - 1
                                                ]?.[1]
                                              }
                                              g&nbsp;&nbsp;
                                            </Text>
                                            <Text variant="body" fontSize={14}>
                                              Target:&nbsp;
                                              {
                                                dailyTargetResults[
                                                  dayjs().diff(
                                                    dayjs(item[0]).date(day),
                                                    "day",
                                                  ) - 1
                                                ]?.[3]
                                              }
                                              g
                                            </Text>
                                          </Box>
                                          <View
                                            style={styles.arrowForTipContainer}
                                          >
                                            <Box
                                              style={styles.arrowForTip}
                                              backgroundColor="cardBackground"
                                              borderRadius="s"
                                            />
                                          </View>
                                        </Box>
                                      </Animated.View>
                                    )}
                                  <View style={styles.belowIconContainer}>
                                    <View style={styles.belowIcon}>
                                      {targetMet && (
                                        <Icon
                                          icon={Check}
                                          size={10}
                                          color={"secondaryText"}
                                          strokeWidth={5}
                                        />
                                      )}
                                      {targetMet === false && (
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
            <View style={styles.proteinStatsContainer}>
              <View style={styles.proteinStats}>
                <Text
                  fontSize={14}
                  color="tertiaryText"
                  marginRight="xs"
                  variant="medium"
                >
                  Averaged
                </Text>
                <SlotNumbers
                  value={proteinAggregates.avgProteinPerDay}
                  fontStyle={[
                    styles.slotNumbers,
                    { color: theme.colors.tertiaryText },
                  ]}
                  spring
                />
                <Text fontSize={14} color="tertiaryText" variant="medium">
                  g
                </Text>
                <Text
                  fontSize={14}
                  color="tertiaryText"
                  variant="medium"
                  marginLeft="xs"
                >
                  / day
                </Text>
              </View>
            </View>
          </View>
        </OutsidePressHandler>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  innerBox: {
    height: "100%",
    paddingBottom: 50,
  },
  calendarContainer: {
    position: "absolute",
    alignItems: "flex-start",
    top: -8,
    left: 0,
    right: 0,
  },
  slotNumbers: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  proteinStats: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "baseline",
  },
  proteinStatsContainer: {
    position: "absolute",
    bottom: -16,
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
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
    padding: 3,
  },
  aboveTipContainer: {
    position: "absolute",
    top: -24,
    zIndex: 100,
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  aboveTip: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowForTipContainer: {
    position: "absolute",
    bottom: 2,
    left: "50%",
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowForTip: {
    position: "absolute",
    width: 15,
    height: 15,
    transform: [{ rotate: "45deg" }],
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
