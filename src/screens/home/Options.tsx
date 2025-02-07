import { useState, useRef } from "react";
import dayjs from "dayjs";
import { StyleSheet, Animated, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@shopify/restyle";

import { useAppDispatch } from "@store/hooks";
import { Box } from "@components";
import { Button } from "@components";
import { removeEntry } from "@store/slices/proteinSlice";
import { dayFormat } from "@constants/formats";
import type { ProteinEntry } from "@store/slices/proteinSlice";

const ACTIONS_WIDTH = 110;
const THRESHOLD = ACTIONS_WIDTH / 2;
const ESCAPE_VELOCITY = 1.5;

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
  const isOpen = useRef(false);

  const pan = useRef(new Animated.Value(0)).current;

  const closeSwipe = () => {
    Animated.spring(pan, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    isOpen.current = false;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => {
        // Only capture horizontal movements
        console.log(
          "capturing: ",
          Math.abs(gs.dx) > Math.abs(gs.dy),
          gs.dx,
          gs.dy,
        );
        return Math.abs(gs.dx) > Math.abs(gs.dy);
      },
      onPanResponderMove: (_, gs) => {
        // Only allow negative (leftward) translations
        if (gs.dx <= 0 && !isOpen.current) {
          const x = Math.max(-ACTIONS_WIDTH, gs.dx);
          pan.setValue(x);
        } else if (gs.dx > 0 && isOpen.current) {
          pan.setValue(-ACTIONS_WIDTH + gs.dx);
        }
      },
      onPanResponderRelease: (_, gs) => {
        const shouldOpen = gs.vx < -ESCAPE_VELOCITY || gs.dx < -THRESHOLD;
        if (shouldOpen && !isOpen.current) {
          Animated.spring(pan, {
            toValue: -ACTIONS_WIDTH,
            useNativeDriver: true,
          }).start(() => {
            isOpen.current = true;
          });
        } else if (isOpen.current && gs.dx > 0) {
          closeSwipe();
        }
        // Snap back to close, thresholds/escape not reached
        else if (!isOpen.current) {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => {
            isOpen.current = false;
          });
        }
      },
    }),
  ).current;

  const handleDelete = () => {
    closeSwipe();
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
      <Animated.View
        style={{
          transform: [{ translateX: pan }],
        }}
        {...panResponder.panHandlers}
      >
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
    </Box>
  );
};

export default Options;
