import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
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

import { Box } from "./base/Box";
import { Button } from "./base/Button";
import OutsidePressHandler from "react-native-outside-press";

const ACTIONS_WIDTH = 105;
const THRESHOLD = ACTIONS_WIDTH / 2;

interface OptionsProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  noEdit?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
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

export const SwipeOptions = ({
  children,
  onDelete,
  onEdit,
  noEdit,
  onOpen,
  onClose,
}: OptionsProps) => {
  const theme = useTheme();
  const isEditable = noEdit ? 1.5 : 1;

  const translateX = useSharedValue(0);
  const [isOpenState, setIsOpenState] = useState(false);
  const isOpen = useSharedValue(false);

  const closeSwipe = () => {
    translateX.value = withTiming(0);
  };

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      const x = Math.min(
        0,
        Math.max((-ACTIONS_WIDTH - 12) / isEditable, event.translationX),
      );
      translateX.value = isOpen.value ? withSpring(0) : x;
    })
    .onEnd((event) => {
      const shouldOpen =
        event.velocityX < -500 ||
        (translateX.value < -THRESHOLD && event.velocityX > -500);

      if (shouldOpen) {
        translateX.value = withSpring((-ACTIONS_WIDTH - 12) / isEditable);
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

  useEffect(() => {
    if (isOpenState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpenState]);

  const handleDelete = () => {
    runOnJS(closeSwipe)();
    if (onDelete) {
      runOnJS(onDelete)();
    }
  };

  const handleEdit = () => {
    runOnJS(closeSwipe)();
    if (onEdit) {
      runOnJS(onEdit)();
    }
  };

  return (
    <Box overflow="hidden">
      <OutsidePressHandler onOutsidePress={closeSwipe}>
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
                {isEditable <= 1 && (
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
                )}
              </Box>
              {children}
            </Box>
          </Animated.View>
        </GestureDetector>
      </OutsidePressHandler>
    </Box>
  );
};
