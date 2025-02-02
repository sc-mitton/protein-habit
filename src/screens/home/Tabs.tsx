import { useState, useRef, useEffect } from "react";
import { Dimensions, StyleSheet, Platform } from "react-native";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Box, Button } from "@components";
import Entries from "./Entries";
import Stats from "./Stats";
import PagerView from "react-native-pager-view";

const TAB_INDICATOR_OFFSET = 18;

const Tabs = () => {
  const indicatorWidth = useSharedValue(0);
  const indicatorX = useSharedValue(TAB_INDICATOR_OFFSET);
  const [selectedTab, setSelectedTab] = useState(0);
  const tabHeaderWidths = useRef(new Array(2).fill(0));
  const pagerState = useRef<"idle" | "settling" | "dragging">();
  const pagerRef = useRef<PagerView>(null);
  const lockIndicatorAnimation = useRef(false);

  const indicatorAnimation = useAnimatedStyle(() => {
    return {
      position: "absolute",
      bottom: 0,
      height: 4,
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorX.value }],
    };
  });

  const tab1HeaderAnimation = useAnimatedStyle(() => {
    return {
      opacity: selectedTab === 0 ? withTiming(1) : withTiming(0.5),
    };
  });

  const tab2HeaderAnimation = useAnimatedStyle(() => {
    return {
      opacity: selectedTab === 1 ? withTiming(1) : withTiming(0.5),
    };
  });

  useEffect(() => {
    if (selectedTab === 0) {
      indicatorWidth.value = withTiming(tabHeaderWidths.current[0]);
      indicatorX.value = withTiming(TAB_INDICATOR_OFFSET);
    } else {
      indicatorWidth.value = withTiming(tabHeaderWidths.current[1]);
      indicatorX.value = withTiming(
        tabHeaderWidths.current[1] + TAB_INDICATOR_OFFSET,
      );
    }
  }, [selectedTab]);

  return (
    <Box flex={4}>
      <Box
        flexDirection="row"
        justifyContent="flex-start"
        gap="m"
        paddingHorizontal="m"
        paddingBottom="s"
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
            onPress={() => {
              pagerRef.current?.setPage(0);
              lockIndicatorAnimation.current = true;
            }}
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
            onPress={() => {
              pagerRef.current?.setPage(1);
              lockIndicatorAnimation.current = true;
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
      <Box
        justifyContent="center"
        borderTopWidth={Platform.OS === "android" ? 2 : 0}
        borderTopColor="seperator"
        shadowColor="seperator"
        backgroundColor="mainBackground"
        shadowOffset={{ width: 0, height: -2 }}
        shadowOpacity={1}
        shadowRadius={1}
        elevation={12}
        flex={1}
      >
        <PagerView
          ref={pagerRef}
          onPageSelected={(e) => {
            setSelectedTab(e.nativeEvent.position);
          }}
          onPageScrollStateChanged={(e) => {
            pagerState.current = e.nativeEvent.pageScrollState;
            if (pagerState.current === "idle") {
              lockIndicatorAnimation.current = false;
            }
          }}
          onPageScroll={(e) => {
            if (
              pagerState.current === "settling" ||
              lockIndicatorAnimation.current
            ) {
              return;
            }
            const delta =
              Math.min(
                Math.abs(1 - e.nativeEvent.offset),
                Math.abs(0 - e.nativeEvent.offset),
              ) * 50;
            indicatorWidth.value = tabHeaderWidths.current[selectedTab] + delta;
            if (selectedTab === 1) {
              indicatorX.value =
                tabHeaderWidths.current[1] - delta + TAB_INDICATOR_OFFSET;
            }
          }}
          style={StyleSheet.absoluteFill}
          initialPage={0}
        >
          <View key="1" style={styles.page}>
            <Stats />
          </View>
          <View key="2" style={styles.page}>
            <Entries />
          </View>
        </PagerView>
      </Box>
    </Box>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  page: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});
