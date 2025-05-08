import { useEffect, useRef } from "react";
import { StyleSheet, Dimensions, PanResponder, View } from "react-native";
import Animated, {
  withTiming,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";

import { Box } from "@components";
import Entries from "./Entries";
import Stats from "./Stats";
import { TAB_INDICATOR_OFFSET } from "./constants";
import { useTabs } from "./tabsContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Tabs = () => {
  const {
    indicatorX,
    indicatorWidth,
    selectedTab,
    setSelectedTab,
    tabHeaderWidths,
    lockPagerScroll,
  } = useTabs();

  const selectedTabRef = useRef(selectedTab);
  const translateX = useSharedValue(selectedTab * -SCREEN_WIDTH);
  const isDragging = useSharedValue(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => {
        const { dx, dy } = gestureState;
        if (lockPagerScroll.current) {
          return false;
        }
        return selectedTabRef.current === 0
          ? Math.abs(dx) > Math.abs(dy)
          : Math.abs(dx) > Math.abs(dy) && dx > 0;
      },
      onStartShouldSetPanResponderCapture: (e, gestureState) => {
        const { dx, dy } = gestureState;
        if (lockPagerScroll.current) {
          return false;
        }
        return selectedTabRef.current === 0
          ? Math.abs(dx) > Math.abs(dy)
          : Math.abs(dx) > Math.abs(dy) && dx > 0;
      },
      onMoveShouldSetPanResponderCapture(e, gestureState) {
        const { dx, dy } = gestureState;
        if (lockPagerScroll.current) {
          return false;
        }
        return selectedTabRef.current === 0
          ? Math.abs(dx) > Math.abs(dy)
          : Math.abs(dx) > Math.abs(dy) && dx > 0;
      },
      onPanResponderGrant: () => {
        isDragging.value = true;
      },
      onPanResponderMove: (_, gestureState) => {
        const newX = selectedTabRef.current * -SCREEN_WIDTH + gestureState.dx;
        translateX.value = newX;

        // Calculate progress for indicator animation
        const progress = Math.abs(gestureState.dx) / SCREEN_WIDTH;
        const direction = gestureState.dx > 0 ? -1 : 1;

        if (selectedTabRef.current === 0 && direction === 1) {
          const dampenedProgress = (2 * progress) / (4 * progress + 1);
          indicatorWidth.value =
            tabHeaderWidths.current[selectedTabRef.current] +
            tabHeaderWidths.current[selectedTabRef.current] * dampenedProgress;
        } else if (selectedTabRef.current === 1 && direction === -1) {
          const dampenedProgress = (2 * progress) / (4 * progress + 1);
          indicatorX.value =
            TAB_INDICATOR_OFFSET +
            tabHeaderWidths.current[selectedTabRef.current] -
            tabHeaderWidths.current[selectedTabRef.current] * dampenedProgress;
          indicatorWidth.value =
            tabHeaderWidths.current[selectedTabRef.current] +
            tabHeaderWidths.current[selectedTabRef.current] * dampenedProgress;
        }
      },
      onPanResponderTerminate: (_, gestureState) => {
        isDragging.value = false;
        const velocity = gestureState.vx;
        const threshold = SCREEN_WIDTH * 0.3;

        let newTab = selectedTabRef.current;
        if (Math.abs(gestureState.dx) > threshold || Math.abs(velocity) > 0.5) {
          newTab =
            gestureState.dx > 0
              ? Math.max(0, selectedTabRef.current - 1)
              : Math.min(1, selectedTabRef.current + 1);
        }
        runOnJS(setSelectedTab)(newTab);
        translateX.value = withTiming(newTab * -SCREEN_WIDTH);
        animateTo(newTab);
      },
      onPanResponderRelease: (_, gestureState) => {
        isDragging.value = false;
        const velocity = gestureState.vx;
        const threshold = SCREEN_WIDTH * 0.3;

        let newTab = selectedTabRef.current;
        if (Math.abs(gestureState.dx) > threshold || Math.abs(velocity) > 0.5) {
          newTab =
            gestureState.dx > 0
              ? Math.max(0, selectedTabRef.current - 1)
              : Math.min(1, selectedTabRef.current + 1);
        }
        runOnJS(setSelectedTab)(newTab);
        translateX.value = withTiming(newTab * -SCREEN_WIDTH);
        animateTo(newTab);
      },
    }),
  ).current;

  const animateTo = (page: number) => {
    indicatorWidth.value = withTiming(tabHeaderWidths.current[page]);
    indicatorX.value = withTiming(
      TAB_INDICATOR_OFFSET + (page === 0 ? 0 : tabHeaderWidths.current[page]),
    );
  };

  useEffect(() => {
    animateTo(selectedTab);
    translateX.value = withTiming(selectedTab * -SCREEN_WIDTH);
    selectedTabRef.current = selectedTab;
  }, [selectedTab]);

  return (
    <Box flexGrow={1}>
      <Box
        shadowColor="sectionShadow"
        shadowOpacity={1}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={64}
        elevation={64}
        backgroundColor="secondaryBackground"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        height={100}
        zIndex={-1}
        borderTopEndRadius="xl"
        borderTopStartRadius="xl"
        pointerEvents="none"
      />
      <Box
        justifyContent="center"
        borderTopEndRadius="xl"
        borderTopStartRadius="xl"
        flex={1}
        flexGrow={1}
        zIndex={0}
        backgroundColor="secondaryBackground"
      >
        <Animated.View style={styles.container} {...panResponder.panHandlers}>
          <Animated.View
            style={[styles.contentContainer, { transform: [{ translateX }] }]}
          >
            <Box>
              <Stats />
            </Box>
            <Box>
              <Entries />
            </Box>
          </Animated.View>
        </Animated.View>
      </Box>
    </Box>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
});
