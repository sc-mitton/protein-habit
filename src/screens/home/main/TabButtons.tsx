import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Platform, StyleSheet } from "react-native";

import { Box, Button } from "@components";
import { TAB_INDICATOR_OFFSET } from "./constants";
import { useTabs } from "./tabsContext";

const TabButtons = () => {
  const tab0Opacity = useSharedValue(1);
  const tab1Opacity = useSharedValue(0.5);

  const {
    selectedTab,
    setSelectedTab,
    indicatorX,
    indicatorWidth,
    pagerRef,
    tabHeaderWidths,
  } = useTabs();

  const tab1HeaderAnimation = useAnimatedStyle(() => {
    return {
      opacity: tab0Opacity.value,
      zIndex: 1,
    };
  });

  const tab2HeaderAnimation = useAnimatedStyle(() => {
    return {
      opacity: tab1Opacity.value,
      zIndex: 1,
    };
  });

  const indicatorAnimation = useAnimatedStyle(() => {
    return {
      position: "absolute",
      bottom: 0,
      height: 4,
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorX.value }],
    };
  });

  const animated = (index: number) => {
    indicatorWidth.value = withTiming(tabHeaderWidths.current[index]);
    indicatorX.value = withTiming(
      TAB_INDICATOR_OFFSET + (index === 0 ? 0 : tabHeaderWidths.current[index]),
    );
    tab0Opacity.value = withTiming(index === 0 ? 1 : 0.5);
    tab1Opacity.value = withTiming(index === 0 ? 0.5 : 1);
  };

  const handleTabPress = (index: number) => {
    setSelectedTab(index);
    animated(index);
    pagerRef.current?.setPage(index);
  };

  useEffect(() => {
    animated(selectedTab);
  }, [selectedTab]);

  return (
    <Box
      flexDirection="row"
      justifyContent="flex-start"
      gap="m"
      paddingHorizontal="m"
      zIndex={2}
    >
      <Animated.View
        style={tab1HeaderAnimation}
        onLayout={(e) => {
          tabHeaderWidths.current[0] = e.nativeEvent.layout.width;
          indicatorWidth.value = e.nativeEvent.layout.width;
        }}
      >
        <Button
          label={"Stats"}
          onPress={() => handleTabPress(0)}
          disabled={Platform.OS !== "ios"}
        />
      </Animated.View>
      <Animated.View
        style={tab2HeaderAnimation}
        onLayout={(e) => {
          tabHeaderWidths.current[1] = e.nativeEvent.layout.width;
        }}
      >
        <Button
          label="Entries"
          disabled={Platform.OS !== "ios"}
          onPress={() => {
            handleTabPress(1);
          }}
        />
      </Animated.View>
      <Animated.View style={indicatorAnimation}>
        <Box
          accent={true}
          style={StyleSheet.absoluteFill}
          backgroundColor="tertiaryText"
          borderTopLeftRadius="s"
          borderTopRightRadius="s"
        />
      </Animated.View>
    </Box>
  );
};

export default TabButtons;
