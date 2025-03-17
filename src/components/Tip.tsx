import { useState } from "react";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";
import OutsidePressHandler from "react-native-outside-press";

import { Text, Box } from "@components";

export const Tip = ({
  children,
  label,
  maxWidth = 200,
  offset = 0,
  onShow,
  onHide,
}: {
  children: React.ReactNode;
  label?: string;
  maxWidth?: number;
  offset?: number;
  onShow?: () => void;
  onHide?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <OutsidePressHandler
      onOutsidePress={() => {
        setIsOpen(false);
        onHide?.();
      }}
    >
      <Box alignItems="center">
        <TouchableOpacity
          onPress={() => {
            setIsOpen(!isOpen);
            onShow?.();
          }}
          disabled={!label}
        >
          {children}
        </TouchableOpacity>
        {isOpen && (
          <TipContainer offset={offset}>
            <Box maxWidth={maxWidth}>
              <Text variant="body" fontSize={14}>
                {label}
              </Text>
            </Box>
          </TipContainer>
        )}
      </Box>
    </OutsidePressHandler>
  );
};

export const TipContainer = ({
  children,
  offset = 0,
}: {
  children: React.ReactNode;
  offset?: number;
}) => (
  <Animated.View
    entering={FadeInUp}
    exiting={FadeOut.duration(300)}
    style={[styles.aboveTipContainer]}
  >
    <Box
      backgroundColor="cardBackground"
      borderRadius="l"
      shadowColor="defaultShadow"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.7}
      shadowRadius={12}
      elevation={12}
      style={[styles.aboveTip, { transform: [{ translateX: offset }] }]}
    >
      <Box marginHorizontal="s" marginVertical="xs" flexDirection="row">
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

const styles = StyleSheet.create({
  aboveTipContainer: {
    position: "absolute",
    zIndex: 200,
    left: "50%",
    top: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  aboveTip: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
    zIndex: 200,
    padding: 4,
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

export default Tip;
