import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@shopify/restyle";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { useAppDispatch } from "@store/hooks";
import { Box } from "@components";
import { Button } from "@components";
import { removeEntry } from "@store/slices/proteinSlice";
import { dayFormat } from "@constants/formats";
import type { ProteinEntry } from "@store/slices/proteinSlice";

const ACTIONS_WIDTH = 110;
const THRESHOLD = ACTIONS_WIDTH / 2;

interface OptionsProps {
  children: React.ReactNode;
  entry: ProteinEntry;
}

const styles = StyleSheet.create({
  actionsContainer: {
    position: "absolute",
    alignItems: "center",
    height: "100%",
    right: -ACTIONS_WIDTH,
    width: ACTIONS_WIDTH,
  },
  actions: {
    position: "relative",
  },
  button: {
    width: ACTIONS_WIDTH / 2 - 8,
    marginLeft: 8,
  },
});

const Options = ({ children, entry }: OptionsProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const theme = useTheme();

  const translateX = useSharedValue(0);
  const [isOpenState, setIsOpenState] = useState(false);
  const isOpen = useSharedValue(false);

  const closeSwipe = () => {
    translateX.value = withTiming(0);
  };

  const gesture = Gesture.Pan()
    .failOffsetX(isOpenState ? [-Infinity, Infinity] : 0)
    .activeOffsetX([-5, 5])
    .onUpdate((event) => {
      const x = Math.min(0, Math.max(-ACTIONS_WIDTH, event.translationX));
      translateX.value = isOpen.value ? withSpring(0) : x;
    })
    .onEnd((event) => {
      const shouldOpen =
        event.velocityX < -500 ||
        (translateX.value < -THRESHOLD && event.velocityX > -500);

      if (shouldOpen) {
        translateX.value = withSpring(-ACTIONS_WIDTH);
        runOnJS(setIsOpenState)(true);
        isOpen.value = true;
      } else {
        runOnJS(closeSwipe)();
        runOnJS(setIsOpenState)(false);
        isOpen.value = false;
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleDelete = () => {
    runOnJS(closeSwipe)();
    dispatch(
      removeEntry({
        day: dayjs().format(dayFormat),
        id: entry.id,
      }),
    );
  };

  const handleEdit = () => {
    closeSwipe();
    if (entry.food) {
      navigation.navigate("MyFoods", { entry });
    } else {
      navigation.navigate("Entry", { entry });
    }
  };

  return (
    <Box overflow="hidden">
      <GestureDetector gesture={gesture} touchAction={"pan-x"}>
        <Animated.View style={rStyle}>
          <Box style={styles.actions}>
            <Box style={[styles.actionsContainer]} flexDirection="row">
              <Button
                style={styles.button}
                backgroundColor="primaryButton"
                padding="s"
                borderRadius="m"
                justifyContent="center"
                alignItems="center"
                onPress={handleDelete}
                icon={
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color={theme.colors.error}
                  />
                }
              />
              <Button
                style={styles.button}
                backgroundColor="primaryButton"
                padding="s"
                borderRadius="m"
                justifyContent="center"
                alignItems="center"
                onPress={handleEdit}
                icon={
                  <Ionicons
                    name="pencil"
                    size={24}
                    color={theme.colors.primaryText}
                  />
                }
              />
            </Box>
            {children}
          </Box>
        </Animated.View>
      </GestureDetector>
    </Box>
  );
};

export default Options;
