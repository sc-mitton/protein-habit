import { Fragment, useEffect, useState } from "react";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ZeroConfig } from "geist-native-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { StyleSheet, Dimensions } from "react-native";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { Box, Text, Icon, Button, SwipeOptions } from "@components";
import { selectDaysEntries } from "@store/slices/proteinSelectors";
import { selectFoods } from "@store/slices/foodsSlice";
import { dayFormat, dayTimeFormat } from "@constants/formats";
import { removeEntry } from "@store/slices/proteinSlice";

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 12,
    paddingHorizontal: 9,
    zIndex: 100,
  },
});

const Days = ({
  day,
  setDay,
}: {
  day: string;
  setDay: (day: string) => void;
}) => {
  const pillX = useSharedValue(0);
  const daysHorizontalMargin = 8;
  const pillWidth =
    (Dimensions.get("window").width - daysHorizontalMargin * 2) / 7;

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    left: 0,
    position: "absolute",
    top: "50%",
    justifyContent: "center",
    alignItems: "center",
    width: pillWidth,
  }));

  useEffect(() => {
    const index = dayjs(day).diff(dayjs().startOf("week"), "day");
    pillX.value = withTiming((index + 0.5) * pillWidth);
  }, [day]);

  return (
    <Box
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
      marginVertical="s"
      style={{
        marginHorizontal: daysHorizontalMargin,
      }}
    >
      <Animated.View style={pillStyle}>
        <Box
          width={pillWidth - 12}
          style={{ transform: [{ translateX: -pillWidth / 2 }] }}
          height={58}
          borderColor="primaryButton"
          borderWidth={1.5}
          position="absolute"
          borderRadius="l"
        />
      </Animated.View>
      {Array.from({ length: 7 }).map((_, index) => {
        const disabled = dayjs().isBefore(
          dayjs().startOf("week").add(index, "day"),
        );
        return (
          <Button
            key={`entrie-days-day-${index}`}
            width={pillWidth}
            paddingVertical="sm"
            paddingHorizontal="none"
            alignItems="center"
            justifyContent="center"
            disabled={disabled}
            textColor={
              dayjs().isBefore(dayjs().startOf("week").add(index, "day"))
                ? "tertiaryText"
                : "primaryText"
            }
            backgroundColor="transparent"
            onPress={() => {
              setDay(
                dayjs().startOf("week").add(index, "day").format(dayTimeFormat),
              );
            }}
          >
            <Box flexDirection="column" alignItems="center">
              <Text
                variant="bold"
                color={disabled ? "quaternaryText" : "secondaryText"}
              >
                {dayjs().startOf("week").add(index, "day").format("D")}
              </Text>
              <Text
                accent={!disabled}
                fontSize={14}
                color={disabled ? "quaternaryText" : "primaryText"}
              >
                {dayjs().startOf("week").add(index, "day").format("dd")}
              </Text>
            </Box>
          </Button>
        );
      })}
    </Box>
  );
};

const Entries = () => {
  const dispatch = useAppDispatch();
  const [day, setDay] = useState(dayjs().format(dayTimeFormat));
  const navigation = useNavigation<any>();
  const daysEntries = useAppSelector((state) =>
    selectDaysEntries(state, dayjs(day).format(dayTimeFormat)),
  );
  const foods = useAppSelector(selectFoods);

  return (
    <Fragment>
      <Days day={day} setDay={setDay} />
      {daysEntries && daysEntries?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {daysEntries.map((entry, entryIndex) => (
            <Animated.View layout={LinearTransition} key={entry.id}>
              {entryIndex !== 0 && (
                <Box
                  height={1.5}
                  backgroundColor="borderColor"
                  marginHorizontal="s"
                />
              )}
              <SwipeOptions
                onDelete={() => {
                  dispatch(
                    removeEntry({
                      day: dayjs().format(dayFormat),
                      id: entry.id,
                    }),
                  );
                }}
                onEdit={() => {
                  if (entry.food) {
                    navigation.navigate("MyFoods", { entry });
                  } else {
                    navigation.navigate("Entry", { entry });
                  }
                }}
              >
                <Box
                  flexDirection="row"
                  padding="m"
                  justifyContent="space-between"
                  alignItems="center"
                  gap="m"
                  backgroundColor="secondaryBackground"
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
                    gap="s"
                  >
                    <Text>{entry.name || entry.description}</Text>
                  </Box>
                  <Text color="secondaryText">
                    {dayjs()
                      .hour(parseInt(entry.time.split(":")[0]))
                      .minute(parseInt(entry.time.split(":")[1]))
                      .format("h:mm A")}
                  </Text>
                </Box>
              </SwipeOptions>
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
          <Text color="tertiaryText">No entries</Text>
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
