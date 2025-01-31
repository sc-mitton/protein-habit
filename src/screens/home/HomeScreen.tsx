import { useEffect, useState, useRef } from "react";
import SlotNumbers from "react-native-slot-numbers";
import { Edit, Plus } from "geist-native-icons";
import { Animated } from "react-native";
import { View } from "react-native";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";

import styles from "./styles/home-screen";
import { Box, Text, Button, Icon } from "@components";
import {
  selectTotalProteinForDay,
  addProteinEntry,
} from "@store/slices/proteinSlice";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { RootScreenProps } from "@types";
import { selectFont } from "@store/slices/uiSlice";
import Calendar from "./Calendar";
import Stats from "./Stats";

const BUFFER_ADD_TIME = 3000;

const HomeScreen = (props: RootScreenProps<"Home">) => {
  const theme = useTheme();

  const dispatch = useAppDispatch();
  const font = useAppSelector(selectFont);
  const { name } = useAppSelector((state) => state.user);
  const totalProteinForDay = useAppSelector((state) =>
    selectTotalProteinForDay(state, dayjs().format("MM-DD-YYYY")),
  );
  const [bufferAddVal, setBufferAddVal] = useState(0);
  const [bufferAddTimer, setBufferAddTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const opacity = useRef(new Animated.Value(0)).current;

  // Every time the bufferAddVal changes before the timer expires, it resets the timer
  // If the timer expires, it adds the bufferAddVal to the totalProteinForDay

  useEffect(() => {
    if (bufferAddVal > 0) {
      if (bufferAddTimer) {
        clearTimeout(bufferAddTimer);
      }
      setBufferAddTimer(
        setTimeout(() => {
          dispatch(addProteinEntry(bufferAddVal));
        }, BUFFER_ADD_TIME),
      );
    }
  }, [bufferAddVal]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    const t = setTimeout(() => {
      setBufferAddVal(0);
    }, 1000);
    return () => clearTimeout(t);
  }, [totalProteinForDay]);

  useEffect(() => {
    if (bufferAddVal > 0) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [bufferAddVal]);

  useEffect(() => {
    console.log("totalProteinForDay: ", totalProteinForDay);
  }, [totalProteinForDay]);

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box paddingHorizontal="m">
        <Text variant="header">Welcome, {name}</Text>
        <Text variant="subheader">{dayjs().format("MMM D, YYYY")}</Text>
      </Box>
      <Box
        padding="m"
        marginTop="l"
        marginBottom="s"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        flex={1}
      >
        <Box flexDirection="row" alignItems={"baseline"} gap="s">
          <Animated.View style={[styles.bufferNumber, { opacity }]}>
            <View>
              <SlotNumbers
                spring
                animateIntermediateValues
                prefix={"+"}
                value={bufferAddVal}
                fontStyle={[
                  styles.smallSlotNumbersStyle,
                  { color: theme.colors.primaryText },
                ]}
              />
            </View>
          </Animated.View>
          <SlotNumbers
            spring
            animateIntermediateValues
            value={totalProteinForDay}
            fontStyle={[
              styles.bigSlotNumbersStyle,
              { color: theme.colors.primaryText },
              styles[font],
            ]}
          />
          <Text
            variant="bold"
            marginTop="xs"
            marginLeft="ns"
            fontSize={20}
            style={styles[font]}
          >
            grams
          </Text>
        </Box>
        <Box flexDirection="row" gap="m" paddingRight="m">
          <Button
            borderRadius="full"
            backgroundColor="transparent"
            borderColor="seperator"
            borderWidth={1}
            padding="m"
            onPress={() => {
              props.navigation.navigate("ProteinEntry");
            }}
            icon={
              <Icon icon={Edit} size={20} color="primaryText" strokeWidth={2} />
            }
          />
          <Button
            borderRadius="full"
            backgroundColor="transparent"
            borderColor="seperator"
            borderWidth={1}
            padding="m"
            onPress={() => {
              setBufferAddVal(bufferAddVal + 1);
            }}
            icon={
              <Icon icon={Plus} size={20} color="primaryText" strokeWidth={2} />
            }
          />
        </Box>
      </Box>
      <Stats />
      <Calendar />
    </Box>
  );
};

export default HomeScreen;
