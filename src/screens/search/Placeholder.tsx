import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";

const placeholders = [
  "Chipotle Steak Burrito",
  "Mac and Cheese",
  "Chic-Fil-A Cool Wrap",
  "Chicken Alfredo",
];

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Placeholder = () => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {placeholders[index].split("").map((char, i, arr) => (
        <Animated.Text
          key={`placeholder-${index}-char-${i}`}
          entering={FadeIn.delay(i * 30).duration(300)}
          exiting={FadeOut.delay(i * 30).duration(300)}
          style={{ color: theme.colors.placeholderText }}
        >
          {char}
        </Animated.Text>
      ))}
    </View>
  );
};

export default Placeholder;
