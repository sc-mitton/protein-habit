import { useState } from "react";
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import OutsidePressHandler from "react-native-outside-press";

import { Text, Box, Button } from "@components";

export const Tip = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <OutsidePressHandler onOutsidePress={() => setIsOpen(false)}>
      <Box alignItems="center">
        <Button onPress={() => setIsOpen(!isOpen)}>{children}</Button>
        {isOpen && (
          <TipContainer top={-24}>
            <Text variant="body" fontSize={14}>
              {label}
            </Text>
          </TipContainer>
        )}
      </Box>
    </OutsidePressHandler>
  );
};

const TipContainer = ({
  children,
  top = -36,
}: {
  children: React.ReactNode;
  top?: number;
}) => (
  <Animated.View
    entering={FadeIn.duration(300)}
    style={[styles.aboveTipContainer, { top }]}
  >
    <Box
      backgroundColor="cardBackground"
      borderRadius="m"
      shadowColor="defaultShadow"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={1}
      shadowRadius={12}
      style={styles.aboveTip}
    >
      <Box
        marginHorizontal="s"
        marginVertical="xs"
        flexDirection="row"
        flexWrap="nowrap"
      >
        {children}
      </Box>
      <View style={styles.arrowForTipContainer}>
        <Box
          style={styles.arrowForTip}
          backgroundColor="cardBackground"
          borderRadius="s"
        />
      </View>
    </Box>
  </Animated.View>
);

interface CalendarTipProps {
  targetResult: [string, number, boolean, number];
  onOutsidePress: () => void;
}

export const CalendarTip = (props: CalendarTipProps) => (
  <OutsidePressHandler
    style={styles.aboveTip}
    onOutsidePress={props.onOutsidePress}
  >
    <TipContainer>
      <Text variant="body" fontSize={14}>
        Total:&nbsp;
        {props.targetResult[1]}
        g&nbsp;&nbsp;
      </Text>
      <Text variant="body" fontSize={14}>
        Target:&nbsp;
        {props.targetResult[3]}g
      </Text>
    </TipContainer>
  </OutsidePressHandler>
);

const styles = StyleSheet.create({
  aboveTipContainer: {
    position: "absolute",
    zIndex: 100,
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  aboveTip: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  arrowForTipContainer: {
    position: "absolute",
    bottom: 2,
    left: "50%",
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowForTip: {
    position: "absolute",
    width: 15,
    height: 15,
    transform: [{ rotate: "45deg" }],
  },
});

export default CalendarTip;
