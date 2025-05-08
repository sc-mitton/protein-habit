import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@theme";
import { Box } from "./base";

interface LinearGradientEdgesProps {
  height: number;
}

export const LinearGradientEdges: React.FC<LinearGradientEdgesProps> = ({
  height,
}) => {
  const theme = useTheme<Theme>();

  return (
    <Box style={styles.container} height={height} pointerEvents="none">
      <LinearGradient
        colors={[theme.colors.matchBlurBackground, theme.colors.transparentRGB]}
        style={[styles.gradient, styles.leftGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <LinearGradient
        colors={[theme.colors.transparentRGB, theme.colors.matchBlurBackground]}
        style={[styles.gradient, styles.rightGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    zIndex: 1,
  },
  gradient: {
    top: 0,
    bottom: 0,
    width: 28,
    position: "absolute",
    zIndex: 1,
  },
  leftGradient: {
    left: 0,
  },
  rightGradient: {
    right: 0,
  },
});
