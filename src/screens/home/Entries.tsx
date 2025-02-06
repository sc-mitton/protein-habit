import { Fragment } from "react";
import { selectTodaysEntries } from "@store/slices/proteinSelectors";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Trash2, Edit2, ZeroConfig } from "geist-native-icons";
import dayjs from "dayjs";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useNavigation } from "@react-navigation/native";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { Box, Text, Icon } from "@components";
import { Button } from "@components";
import { selectFoods } from "@store/slices/foodsSlice";
import { RootScreenProps } from "@types";
import { removeEntry } from "@store/slices/proteinSlice";
import { dayFormat } from "@constants/formats";

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Entries = () => {
  const dispatch = useAppDispatch();
  const todaysEntries = useAppSelector(selectTodaysEntries);
  const foods = useAppSelector(selectFoods);
  const { navigation } = useNavigation<RootScreenProps<any>>();

  return (
    <Fragment>
      {todaysEntries?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {todaysEntries.map((entry, entryIndex) => (
            <Animated.View layout={LinearTransition} key={entry.id}>
              <ReanimatedSwipeable
                renderRightActions={() => (
                  <Box
                    flexDirection="row"
                    width={130}
                    height="100%"
                    marginLeft="m"
                    paddingVertical="s"
                    gap="s"
                  >
                    <Button
                      backgroundColor="primaryButton"
                      borderRadius="m"
                      width={60}
                      height="100%"
                      justifyContent="center"
                      alignItems="center"
                      onPress={() => {
                        dispatch(
                          removeEntry({
                            day: dayjs().format(dayFormat),
                            id: entry.id,
                          }),
                        );
                      }}
                      icon={
                        <Icon
                          icon={Trash2}
                          size={20}
                          strokeWidth={2}
                          color="error"
                        />
                      }
                    />
                    <Button
                      backgroundColor="primaryButton"
                      width={60}
                      borderRadius="m"
                      height="100%"
                      justifyContent="center"
                      alignItems="center"
                      onPress={() => {
                        if (entry.food) {
                          navigation.navigate("MyFoods", { entry });
                        } else {
                          navigation.navigate("Entry", { entry });
                        }
                      }}
                      icon={
                        <Icon
                          icon={Edit2}
                          size={20}
                          strokeWidth={2}
                          color="white"
                        />
                      }
                    />
                  </Box>
                )}
                rightThreshold={SCREEN_WIDTH * 0.4}
              >
                <Box
                  flexDirection="row"
                  padding="s"
                  paddingVertical="m"
                  justifyContent="space-between"
                  alignItems="center"
                  gap="l"
                  borderTopColor={
                    entryIndex === 0 ? "transparent" : "seperator"
                  }
                  borderTopWidth={1.5}
                  backgroundColor="mainBackground"
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
                </Box>
              </ReanimatedSwipeable>
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
