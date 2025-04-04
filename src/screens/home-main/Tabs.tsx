import { useRef } from "react";
import { StyleSheet } from "react-native";
import { withTiming } from "react-native-reanimated";
import PagerView from "react-native-pager-view";

import { Box } from "@components";
import Entries from "./Entries";
import Stats from "./Stats";
import { TAB_INDICATOR_OFFSET } from "./constants";
import { useTabs } from "./tabsContext";

const Tabs = () => {
  const {
    pagerRef,
    indicatorX,
    indicatorWidth,
    selectedTab,
    setSelectedTab,
    tabHeaderWidths,
    delta,
  } = useTabs();

  const tabIndicatorState = useRef<"idle" | "dragging" | "settling">("idle");

  return (
    <Box flexGrow={1}>
      <Box
        justifyContent="center"
        borderTopEndRadius="xl"
        borderTopStartRadius="xl"
        flex={1}
        flexGrow={1}
        zIndex={0}
        backgroundColor="secondaryBackground"
        shadowColor="sectionShadow"
        shadowOpacity={1}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={64}
        elevation={64}
      >
        <PagerView
          style={styles.pagerView}
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
            const updatedDelta = (2 * d) / (4 * d + 1);

            if (tabIndicatorState.current === "dragging") {
              delta.value = updatedDelta;
              const extra = updatedDelta * tabHeaderWidths.current[selectedTab];
              indicatorWidth.value =
                tabHeaderWidths.current[selectedTab] + extra;
              if (ne.position != selectedTab) {
                indicatorX.value =
                  TAB_INDICATOR_OFFSET +
                  tabHeaderWidths.current[selectedTab] -
                  extra;
              }
            } else if (tabIndicatorState.current === "settling") {
              // Settling
              if (updatedDelta < delta.value) {
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
          <Stats key={1} />
          <Entries key={2} />
        </PagerView>
      </Box>
    </Box>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
});
