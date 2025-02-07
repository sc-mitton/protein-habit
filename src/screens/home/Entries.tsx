import { Fragment } from "react";
import { selectTodaysEntries } from "@store/slices/proteinSelectors";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ZeroConfig } from "geist-native-icons";
import { ScrollView } from "react-native-gesture-handler";
import dayjs from "dayjs";
import { StyleSheet } from "react-native";

import { useAppSelector } from "@store/hooks";
import { Box, Text, Icon } from "@components";
import { selectFoods } from "@store/slices/foodsSlice";
import EntrySwipe from "./EntrySwipe";

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

const Entries = () => {
  const todaysEntries = useAppSelector(selectTodaysEntries);
  const foods = useAppSelector(selectFoods);

  return (
    <Fragment>
      {todaysEntries?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {todaysEntries.map((entry, entryIndex) => (
            <Animated.View layout={LinearTransition} key={entry.id}>
              <EntrySwipe entry={entry}>
                <Box
                  flexDirection="row"
                  padding="s"
                  paddingVertical="m"
                  justifyContent="space-between"
                  alignItems="center"
                  gap="m"
                  borderBottomColor={
                    entryIndex === todaysEntries.length - 1
                      ? "transparent"
                      : "seperator"
                  }
                  borderBottomWidth={1.5}
                  backgroundColor="mainBackground"
                >
                  <Box minWidth={36}>
                    <Text>{entry.grams}g</Text>
                  </Box>
                  <Box
                    flex={1}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    marginHorizontal="xs"
                  >
                    {foods.find((food) => food.id === entry.food)?.emoji && (
                      <Text>
                        {foods.find((food) => food.id === entry.food)?.emoji}
                      </Text>
                    )}
                    {foods.find((food) => food.id === entry.food)?.name ? (
                      <Text>
                        {foods.find((food) => food.id === entry.food)?.name}
                      </Text>
                    ) : (
                      <Text>{entry.name}</Text>
                    )}
                  </Box>
                  <Text color="secondaryText">
                    {dayjs()
                      .hour(parseInt(entry.time.split(":")[0]))
                      .minute(parseInt(entry.time.split(":")[1]))
                      .format("h:mm A")}
                  </Text>
                </Box>
              </EntrySwipe>
            </Animated.View>
          ))}
        </ScrollView>
      ) : (
        <Box
          justifyContent="center"
          alignItems="center"
          style={StyleSheet.absoluteFill}
          gap="m"
        >
          <Text color="tertiaryText">No entries yet for today</Text>
          <Icon
            color="tertiaryText"
            icon={ZeroConfig}
            size={20}
            strokeWidth={2}
          />
        </Box>
      )}
    </Fragment>
  );
};

export default Entries;
