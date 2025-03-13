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
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTouchScroll, setIsTouchScroll] = useState(false);
  const tabHeaderWidths = useRef(new Array(2).fill(0));
  const pagerRef = useRef<ScrollView>(null);

  const onScrollAnimation = useRef(true);

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
    if (index === 0) {
      indicatorWidth.value = withTiming(tabHeaderWidths.current[0]);
      indicatorX.value = withTiming(TAB_INDICATOR_OFFSET);
      tab0Opacity.value = withTiming(1);
      tab1Opacity.value = withTiming(0.5);
    } else {
      indicatorWidth.value = withTiming(tabHeaderWidths.current[1]);
      indicatorX.value = withTiming(
        tabHeaderWidths.current[1] + TAB_INDICATOR_OFFSET,
      );
      tab0Opacity.value = withTiming(0.5);
      tab1Opacity.value = withTiming(1);
    }
  };

  const handleTabPress = (index: number) => {
    setSelectedTab(index);
    animated(index);
    pagerRef.current?.scrollTo({
      x: index * Dimensions.get("window").width,
      y: 0,
      animated: true,
    });
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
      >
        <Animated.View
          style={tab1HeaderAnimation}
          onLayout={(e) => {
            tabHeaderWidths.current[0] = e.nativeEvent.layout.width;
            indicatorWidth.value = e.nativeEvent.layout.width;
          }}
        >
          <Button label={"Stats"} onPress={() => handleTabPress(0)} />
        </Animated.View>
        <Animated.View
          style={tab2HeaderAnimation}
          onLayout={(e) => {
            tabHeaderWidths.current[1] = e.nativeEvent.layout.width;
          }}
        >
          <Button label="Entries" onPress={() => handleTabPress(1)} />
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
        zIndex={1}
        backgroundColor="secondaryBackground"
        shadowColor="defaultShadow"
        shadowOpacity={Platform.OS === "ios" ? 0.3 : 1}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={12}
        elevation={12}
      >
        <PagerView
          hitSlop={{ top: -84 }}
          style={styles.scrollView}
          initialPage={0}
          onPageScrollStateChanged={(e) => {
            if (e.nativeEvent.pageScrollState === "dragging") {
              onScrollAnimation.current = true;
              setIsTouchScroll(true);
            }
          }}
          orientation="horizontal"
          onPageScroll={({ nativeEvent }) => {
            if (!isTouchScroll) {
              return;
            }
            const delta =
              selectedTab === 0
                ? nativeEvent.offset
                : nativeEvent.offset - Dimensions.get("window").width;
            if (
              nativeEvent.offset > Dimensions.get("window").width / 2 &&
              selectedTab === 0
            ) {
              setSelectedTab(1);
              setIsTouchScroll(false);
            } else if (
              nativeEvent.offset < Dimensions.get("window").width / 2 &&
              selectedTab === 1
            ) {
              setSelectedTab(0);
              setIsTouchScroll(false);
            }
            if (selectedTab === 1) {
              indicatorX.value =
                TAB_INDICATOR_OFFSET + tabHeaderWidths.current[1] + delta / 7;
              indicatorWidth.value = tabHeaderWidths.current[1] - delta / 7;
            } else {
              indicatorWidth.value = tabHeaderWidths.current[0] + delta / 7;
            }
            if (delta === 0) {
              setIsTouchScroll(false);
            }
          }}
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
  scrollView: {
    marginTop: -84,
    paddingTop: 84,
    flex: 1,
  },
  page: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});
