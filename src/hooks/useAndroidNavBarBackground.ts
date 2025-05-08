import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Platform, useColorScheme } from "react-native";

export const useAndroidNavBarBackground = () => {
  const colorScheme = useColorScheme();

  // Set the navigation bar color and button style based on the theme
  useEffect(() => {
    if (Platform.OS !== "android") return;
    setTimeout(() => {
      NavigationBar.setPositionAsync("absolute");
      NavigationBar.setBehaviorAsync("overlay-swipe");
      NavigationBar.setButtonStyleAsync(
        colorScheme === "dark" ? "light" : "dark",
      );
    }, 1000);
  }, []);
};
