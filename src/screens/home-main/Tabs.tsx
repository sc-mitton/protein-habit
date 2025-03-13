import { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import PagerView from "react-native-pager-view";

import { Box, Button } from "@components";
import Entries from "./Entries";
import Stats from "./Stats";

const TAB_INDICATOR_OFFSET = 18;

const Tabs = () => {
  const indicatorWidth = useSharedValue(0);
  const indicatorX = useSharedValue(TAB_INDICATOR_OFFSET);
  const tab0Opacity = useSharedValue(1);
  const tab1Opacity = useSharedValue(0.5);
  const delta = useSharedValue(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const tabHeaderWidths = useRef(new Array(2).fill(0));
  const pagerRef = useRef<PagerView>(null);
  const tabIndicatorState = useRef<"idle" | "dragging" | "settling">("idle");

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
    <Box flexGrow={1}>
      <Box
        flexDirection="row"
        justifyContent="flex-start"
        gap="m"
        paddingHorizontal="m"
        paddingBottom="s"
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
      <Box
        justifyContent="center"
        borderTopEndRadius="xl"
        borderTopStartRadius="xl"
        flex={1}
        zIndex={0}
        backgroundColor="secondaryBackground"
        shadowColor="defaultShadow"
        shadowOpacity={Platform.OS === "ios" ? 0.3 : 1}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={12}
        elevation={12}
      >
        <PagerView
          style={styles.scrollView}
          ref={pagerRef}
          initialPage={0}
          orientation="horizontal"
          onPageSelected={({ nativeEvent }) => {
            setSelectedTab(nativeEvent.position);
          }}
          onPageScrollStateChanged={({ nativeEvent: ne }) => {
            tabIndicatorState.current = ne.pageScrollState;
          }}
          onPageScroll={({ nativeEvent: ne }) => {
            const d = ne.position != selectedTab ? 1 - ne.offset : ne.offset;

            if (tabIndicatorState.current === "dragging") {
              delta.value = d;
              indicatorWidth.value =
                tabHeaderWidths.current[selectedTab] +
                d * tabHeaderWidths.current[selectedTab];
              if (ne.position != selectedTab) {
                indicatorX.value =
                  TAB_INDICATOR_OFFSET +
                  tabHeaderWidths.current[selectedTab] -
                  d * tabHeaderWidths.current[selectedTab];
              }
            } else if (tabIndicatorState.current === "settling") {
              // Settling
              if (d < delta.value) {
                // Settling back to original position
                indicatorWidth.value = withTiming(
                  tabHeaderWidths.current[selectedTab],
                );
                indicatorX.value = withTiming(
                  TAB_INDICATOR_OFFSET +
                    (selectedTab === 0
                      ? 0
                      : tabHeaderWidths.current[selectedTab]),
                );
              } else {
                // Settling to new position
                const newIndex =
                  ne.position != selectedTab ? ne.position : selectedTab + 1;

                indicatorWidth.value = withTiming(
                  tabHeaderWidths.current[newIndex],
                );
                indicatorX.value = withTiming(
                  TAB_INDICATOR_OFFSET +
                    (newIndex === 0 ? 0 : tabHeaderWidths.current[newIndex]),
                );
              }
              tabIndicatorState.current = "idle";
            }
          }}
        >
          <View key="1" style={styles.page}>
            <Stats />
          </View>
          <View key="2" style={styles.page}>
            <Entries />
          </View>
          <View key="3" style={styles.page}>
            <Entries />
          </View>
        </PagerView>
      </Box>
    </Box>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginTop: -84,
  },
  page: {
    paddingTop: 84,
    width: Dimensions.get("window").width,
    height: "100%",
  },
});
