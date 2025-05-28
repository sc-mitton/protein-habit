import React from "react";
import { useTheme } from "@shopify/restyle";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

interface ProgressPieProps {
  progress: number;
  size?: number;
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-90deg" }],
  },
});

export const ProgressPie: React.FC<ProgressPieProps> = ({
  progress,
  size = 20,
}) => {
  const theme = useTheme();
  const accent = useAppSelector(selectAccent);

  const strokeWidth = size / 4;
  const radius = size / 4;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.circle}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Progress Circle (the actual progress section) */}
        <Circle
          stroke={accent ? theme.colors[accent] : theme.colors.secondaryText}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - circumference * (progress * 0.98)}
        />
        {/* Background Circle (the full circle) */}
        <Circle
          stroke={accent ? theme.colors[accent] : theme.colors.primaryText}
          fill="none"
          opacity={0.2}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
      </Svg>
    </View>
  );
};
