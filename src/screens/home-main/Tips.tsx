import React from "react";
import { StyleSheet } from "react-native";
import OutsidePressHandler from "react-native-outside-press";

import { Text, TipContainer } from "@components";

interface CalendarTipProps {
  targetResult: [string, number, boolean, number];
  onOutsidePress: () => void;
}

export const CalendarTip = (props: CalendarTipProps) => (
  <OutsidePressHandler
    style={styles.aboveTip}
    onOutsidePress={props.onOutsidePress}
  >
    <TipContainer offset={3}>
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
  aboveTip: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});

export default CalendarTip;
