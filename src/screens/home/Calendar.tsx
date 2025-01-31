import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from "react-native";
import SlotNumbers from "react-native-slot-numbers";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@theme";
import { LinearGradient } from "expo-linear-gradient";

import { Text, Box } from "@components";
import dayjs from "dayjs";
import { useAppSelector } from "@store/hooks";
import { selectProteinAggregates } from "@store/slices/proteinSlice";
import { selectUserInception } from "@store/slices/userSlice";

const CALENDAR_WIDTH = Dimensions.get("window").width * 0.8;
// the window width minus the calendar width
const CALENDAR_NEGATIVE_SPACE = Dimensions.get("window").width - CALENDAR_WIDTH;
const CALENDAR_PADDING = 6;

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

    data.push([month.format("MMM YYYY"), days]);
  }

  return data.reverse();
};

type Props = {
  position: "left" | "right";
  width?: number;
};

const Calendar = () => {
  const userInception = useAppSelector(selectUserInception);
  const calendarRef = useRef<FlatList>(null);
  const calendarData = useMemo(
    () => generateCalendarData(userInception),
    [userInception],
  );
  const [currentIndex, setCurrentIndex] = useState(calendarData.length - 1);
  const proteinAggregates = useAppSelector((state) =>
    selectProteinAggregates(state, calendarData[currentIndex][0]),
  );
  const theme = useTheme();
  useEffect(() => {
    setTimeout(() => {
      calendarRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, [calendarData]);

  return (
    <Box
      style={styles.container}
      paddingVertical="l"
      shadowColor="primaryText"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.05}
      shadowRadius={3.84}
      elevation={5}
      backgroundColor="secondaryBackground"
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
                index === calendarData.length - 1 && styles.lastScrollContainer,
              ]}
            >
              <Text variant="bold" style={styles.monthHeader}>
                {item[0]}
              </Text>
              <View style={styles.monthContainer} key={item[0]}>
                {item[1].map((days: number[], columnIndex: number) => {
                  return (
                    <View style={styles.column} key={`column-${columnIndex}`}>
                      <View style={styles.cell}>
                        <Text
                          color="secondaryText"
                          variant="bold"
                          fontSize={14}
                        >
                          {dayjs().day(columnIndex).format("dd")[0]}
                        </Text>
                      </View>
                      {days.map((day, index) => {
                        const isBookend =
                          Math.abs(index - Math.floor(day / 7)) > 1;
                        return (
                          <View
                            style={styles.cell}
                            key={`cell-${columnIndex}-${index}`}
                          >
                            <Text
                              color={
                                isBookend ? "quaternaryText" : "primaryText"
                              }
                              fontSize={14}
                            >
                              {day}
                            </Text>
                          </View>
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
            <Text fontSize={14} color="tertiaryText" marginRight="xs">
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
            <Text fontSize={14} color="tertiaryText">
              g
            </Text>
            <Text fontSize={14} color="tertiaryText" marginLeft="xs">
              / day
            </Text>
          </View>
        </View>
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 70,
    flex: 3,
  },
  calendarContainer: {
    position: "absolute",
    alignItems: "flex-start",
    top: 12,
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
  cell: {
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    width: "100%",
  },
});

export default Calendar;
