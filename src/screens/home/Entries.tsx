import { Fragment } from "react";
import { selectTodaysEntries } from "@store/slices/proteinSelectors";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Trash2, ZeroConfig } from "geist-native-icons";
import dayjs from "dayjs";
import { ScrollView, StyleSheet } from "react-native";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { removeEntry } from "@store/slices/proteinSlice";
import { Box, Text, Icon, Button } from "@components";
import { dayFormat } from "@constants/formats";
import { selectFoods } from "@store/slices/foodsSlice";

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

const Entries = () => {
  const dispatch = useAppDispatch();
  const todaysEntries = useAppSelector(selectTodaysEntries);
  const foods = useAppSelector(selectFoods);

  return (
    <Fragment>
      {todaysEntries?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {todaysEntries.map((entry, entryIndex) => (
            <Animated.View layout={LinearTransition} key={entry.id}>
              <Box
                flexDirection="row"
                padding="s"
                justifyContent="space-between"
                alignItems="center"
                gap="l"
                borderTopColor={entryIndex === 0 ? "transparent" : "seperator"}
                borderTopWidth={1.5}
              >
                <Box minWidth={24}>
                  <Text>{entry.grams}g</Text>
                </Box>
                <Box
                  flex={1}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  marginHorizontal="xs"
                  gap="xs"
                >
                  <Text>
                    {foods.find((food) => food.id === entry.food)?.emoji}
                  </Text>
                  <Text>
                    {foods.find((food) => food.id === entry.food)?.name}
                  </Text>
                  <Text>{entry.name}</Text>
                </Box>
                <Text color="secondaryText">
                  {dayjs()
                    .hour(parseInt(entry.time.split(":")[0]))
                    .minute(parseInt(entry.time.split(":")[1]))
                    .format("h:mm A")}
                </Text>
                <Button
                  backgroundColor="primaryButton"
                  onPress={() => {
                    dispatch(
                      removeEntry({
                        day: dayjs().format(dayFormat),
                        id: entry.id,
                      }),
                    );
                  }}
                  icon={<Icon icon={Trash2} size={20} strokeWidth={2} />}
                />
              </Box>
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
