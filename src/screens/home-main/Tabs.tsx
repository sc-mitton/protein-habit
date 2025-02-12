import { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  StyleSheet,
  Platform,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  cancelAnimation,
} from "react-native-reanimated";

import { Box, Button } from "@components";
import Entries from "./Entries";
import Stats from "./Stats";

const TAB_INDICATOR_OFFSET = 18;

const Tabs = () => {
  const indicatorWidth = useSharedValue(0);
  const indicatorX = useSharedValue(TAB_INDICATOR_OFFSET);
  const [selectedTab, setSelectedTab] = useState(0);
  const tabHeaderWidths = useRef(new Array(2).fill(0));
  const scrollRef = useRef<ScrollView>(null);
  const lockIndicatorAnimation = useRef(false);

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
          <Button
            label={"Stats"}
            onPress={() => {
              scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
              lockIndicatorAnimation.current = true;
              indicatorX.value = withTiming(TAB_INDICATOR_OFFSET);
              indicatorWidth.value = withTiming(tabHeaderWidths.current[0]);
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
              scrollRef.current?.scrollTo({
                x: Dimensions.get("window").width,
                y: 0,
                animated: true,
              });
              lockIndicatorAnimation.current = true;
              indicatorX.value = withTiming(
                TAB_INDICATOR_OFFSET + tabHeaderWidths.current[1],
              );
              indicatorWidth.value = withTiming(tabHeaderWidths.current[1]);
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
        backgroundColor="secondaryBackground"
        shadowColor="seperator"
        shadowOffset={{ width: 0, height: -1 }}
        shadowOpacity={0.7}
        shadowRadius={1}
        elevation={12}
        flex={1}
      >
        <ScrollView
          horizontal
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          hitSlop={{ top: -64 }}
          onScrollBeginDrag={() => {
            onScrollAnimation.current = true;
          }}
          onScrollEndDrag={() => {
            onScrollAnimation.current = false;
            cancelAnimation(indicatorX);
            cancelAnimation(indicatorWidth);
            if (selectedTab === 1) {
              indicatorX.value = withSpring(
                TAB_INDICATOR_OFFSET + tabHeaderWidths.current[1],
              );
              indicatorWidth.value = withSpring(tabHeaderWidths.current[1]);
            } else {
              indicatorX.value = withSpring(TAB_INDICATOR_OFFSET);
              indicatorWidth.value = withSpring(tabHeaderWidths.current[0]);
            }
          }}
          onScroll={(e) => {
            const delta =
              selectedTab === 0
                ? e.nativeEvent.contentOffset.x
                : e.nativeEvent.contentOffset.x -
                  Dimensions.get("window").width;

            if (
              e.nativeEvent.contentOffset.x >
              Dimensions.get("window").width / 2
            ) {
              setSelectedTab(1);
            } else {
              setSelectedTab(0);
            }

            // End early if this lock is set (set on scroll end);
            if (!onScrollAnimation.current) return;

            if (selectedTab === 1) {
              indicatorX.value =
                TAB_INDICATOR_OFFSET + tabHeaderWidths.current[1] + delta / 5;
              indicatorWidth.value = tabHeaderWidths.current[1] - delta / 5;
            } else {
              indicatorWidth.value = tabHeaderWidths.current[0] + delta / 5;
            }
          }}
          snapToInterval={Dimensions.get("window").width}
          snapToAlignment="start"
          decelerationRate={0.01}
        >
          <View key="1" style={styles.page}>
            <Stats />
          </View>
          <View key="2" style={styles.page}>
            <Entries />
          </View>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  scrollView: {
    marginTop: -64,
    paddingTop: 64,
  },
  page: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
});
