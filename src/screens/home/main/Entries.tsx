import { useEffect, useState } from "react";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { StyleSheet, Dimensions } from "react-native";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { Box, Text, Icon, Button, SwipeOptions } from "@components";
import { selectDaysEntries } from "@store/slices/proteinSelectors";
import { dayFormat, dayTimeFormat } from "@constants/formats";
import { removeEntry } from "@store/slices/proteinSlice";
import { RootStackParamList } from "@types";

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
  const [containerWidth, setContainerWidth] = useState(0);
  const pillWidth = containerWidth / 7;

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
    if (pillX.value === 0) {
      pillX.value = (index + 0.5) * pillWidth;
    } else {
      pillX.value = withTiming((index + 0.5) * pillWidth);
    }
  }, [day, containerWidth]);

  return (
    <Box
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
      zIndex={100}
      style={{ marginTop: 1 }}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width);
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
          borderRadius="m"
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const daysEntries = useAppSelector((state) =>
    selectDaysEntries(state, dayjs(day).format(dayTimeFormat)),
  );

  return (
    <Box
      justifyContent="flex-start"
      variant="homeTabSection"
      borderBottomLeftRadius="l"
      borderBottomRightRadius="l"
      padding="s"
      paddingHorizontal="m"
      paddingBottom="m"
      marginTop="nm"
      minHeight={200}
    >
      <Days day={day} setDay={setDay} />
      {(!daysEntries || daysEntries?.length <= 0) && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            position="absolute"
            gap="sm"
            alignItems="center"
            justifyContent="center"
            style={{ transform: [{ translateY: "50%" }] }}
          >
            <Text color="quaternaryText" marginTop="nl" fontSize={15}>
              No entries
            </Text>
          </Box>
        </Box>
      )}
      <Box marginTop="s">
        {daysEntries?.map((entry, entryIndex) => (
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
                  navigation.navigate("MyFoodsModal", { entry });
                } else {
                  navigation.navigate("EntryModal", { entry });
                }
              }}
            >
              <Box
                flexDirection="row"
                paddingVertical="m"
                paddingHorizontal="s"
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
                  <Text
                    color={
                      entry.name || entry.description
                        ? "primaryText"
                        : "quaternaryText"
                    }
                  >
                    {entry.name || entry.description || "Untitled"}
                  </Text>
                </Box>
                <Text>
                  {dayjs()
                    .hour(parseInt(entry.time.split(":")[0]))
                    .minute(parseInt(entry.time.split(":")[1]))
                    .format("h:mm A")}
                </Text>
              </Box>
            </SwipeOptions>
          </Animated.View>
        ))}
      </Box>
    </Box>
  );
};

export default Entries;
