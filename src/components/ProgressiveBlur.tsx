import { View, StyleSheet, useColorScheme, ViewStyle } from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    height: "100%",
    width: "100%",
  },
  linearGradient: {
    bottom: 0,
    position: "absolute",
  },
});

export const ProgressiveBlur = ({
  children,
  invert = false,
  end = 1,
  style,
}: {
  children: React.ReactNode;
  invert?: boolean;
  end?: number;
  style?: ViewStyle;
}) => {
  const scheme = useColorScheme();
  const { colors, locations } = easeGradient({
    colorStops: invert
      ? {
          0: { color: "black" },
          [end]: { color: "transparent" },
        }
      : {
          0: { color: "transparent" },
          [end]: { color: "black" },
        },
  });

  return (
    <View style={[styles.container, style]}>
      {children}
      <View style={[styles.blurContainer]}>
        <MaskedView
          maskElement={
            <LinearGradient
              locations={locations as any}
              colors={colors as any}
              style={StyleSheet.absoluteFill}
            />
          }
          style={[StyleSheet.absoluteFill]}
        >
          <BlurView
            intensity={100}
            tint={scheme == "dark" ? "dark" : "light"}
            style={[StyleSheet.absoluteFill]}
          />
        </MaskedView>
      </View>
    </View>
  );
};
