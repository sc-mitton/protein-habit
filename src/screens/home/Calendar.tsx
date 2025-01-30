import React, { useRef, useState, useMemo } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

import { Text, Box } from "@components";
import dayjs from "dayjs";
import { useAppSelector } from "@store/hooks";
import { selectUserInception } from "@store/slices/userSlice";

const ITEM_WIDTH = Dimensions.get("window").width / 7; // Each day takes 1/7th of the screen

// Function to generate calendar data
const generateCalendarData = (userInception: string) => {
  const numMonths = dayjs().diff(dayjs(userInception), "month");
  const data = [];

  for (let i = 0; i < numMonths; i++) {
    const month = dayjs().subtract(i, "month");

    const daysInMonth = month.daysInMonth();
    const previousDaysInMonth = month.subtract(1, "month").daysInMonth();
    const sparePreviousDays = month.day();

    const days = Array.from({ length: daysInMonth })
      .map((_, i) => i + 1)
      .reduce(
        (acc, day, i) => {
          // insert the trailing days from previous month as -1s
          if (i === 0) {
            for (let j = 0; j < sparePreviousDays; j++) {
              acc[sparePreviousDays - j - 1].push(previousDaysInMonth - j);
            }
          }
          // insert the trailing days from next month as -1s
          if (day === daysInMonth) {
            for (
              let i = (day + sparePreviousDays) % 7, k = 1;
              i < 7;
              i++, k++
            ) {
              acc[i].push(k);
            }
          }

          acc[(i + sparePreviousDays) % 7].push(day);
          return acc;
        },
        [...Array.from({ length: 7 }).map(() => [] as number[])],
      );
    data.push([month.format("MMMM YYYY"), days]);
  }

  return data;
};

const StickyCalendar = () => {
  const userInception = useAppSelector(selectUserInception);
  console.log("userInception", userInception);
  const calendarData = useMemo(
    () => generateCalendarData(userInception),
    [userInception],
  );

  console.log("calendarData: ", calendarData);

  return (
    <View style={styles.container}>
      {/* Sticky Month Header */}
      <Box
        style={styles.stickyHeader}
        paddingHorizontal="l"
        paddingVertical="l"
      ></Box>
      {/* Horizontal Calendar */}
      {/* <FlatList
        data={calendarData}
        keyExtractor={(item) => item.month}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // onScroll={handleScroll}
        // onViewableItemsChanged={onViewableItemsChanged}
        // viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => {
          console.log(item);
          return (
            <View style={styles.monthContainer}>
              {item.days.map((day) => (
                <View key={day.date} style={styles.dayItem}>
                  <Text>{day.day}</Text>
                </View>
              ))}
            </View>
          );
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  stickyHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
  },
  monthContainer: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    padding: 10,
  },
  dayItem: {
    width: ITEM_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default StickyCalendar;
