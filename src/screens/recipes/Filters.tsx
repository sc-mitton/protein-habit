import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Box } from "@components";
import { allFilters } from "@db/schema/enums";
import FilterButton from "./FilterButton";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@theme";
import TabButtons from "./TabButtons";

const Filters = () => {
  const theme = useTheme<Theme>();
  const ref = useRef<FlatList>(null);
  const currentSectionIndex = useRef(0);
  const isDragging = useRef(false);
  const [selectedFilterTab, setSelectedFilterTab] = useState(0);

  // The indices in the flatlist of the first item of each tag type section
  const sectionIndexes = useMemo(() => {
    return Object.keys(allFilters).reduce(
      (acc, key, i) => {
        acc.push(
          allFilters[key as keyof typeof allFilters].length +
            acc[acc.length - 1] || 0,
        );
        return acc;
      },
      [0] as number[],
    );
  }, []);

  useEffect(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    if (isDragging.current) return;
    ref.current?.scrollToIndex({
      index: sectionIndexes[selectedFilterTab],
      animated: true,
      viewOffset: 20,
    });
  }, [selectedFilterTab]);

  return (
    <Box marginHorizontal="nm">
      <TabButtons value={selectedFilterTab} onChange={setSelectedFilterTab} />
      <View>
        <LinearGradient
          colors={[
            theme.colors.matchBlurBackground,
            theme.colors.transparentRGB,
          ]}
          style={[styles.gradient, styles.leftGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <LinearGradient
          colors={[
            theme.colors.transparentRGB,
            theme.colors.matchBlurBackground,
          ]}
          style={[styles.gradient, styles.rightGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <FlatList
          ref={ref}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScrollToIndexFailed={() => {}}
          onScrollBeginDrag={() => {
            isDragging.current = true;
          }}
          onMomentumScrollEnd={() => {
            isDragging.current = false;
          }}
          onViewableItemsChanged={({ viewableItems }) => {
            if (!isDragging.current) return;
            const firstItemIndex = viewableItems[0].index || 0;
            const sectionIndex =
              sectionIndexes.findIndex(
                (s, i) =>
                  (firstItemIndex >= s &&
                    firstItemIndex < sectionIndexes[i + 1]) ??
                  Infinity,
              ) || 0;
            if (sectionIndex !== currentSectionIndex.current) {
              currentSectionIndex.current = sectionIndex;
              setSelectedFilterTab(sectionIndex);
            }
          }}
          data={Object.keys(allFilters).reduce((acc, key) => {
            return [...acc, ...allFilters[key as keyof typeof allFilters]];
          }, [] as string[])}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => <FilterButton filter={item} />}
        />
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  filters: {
    gap: 16,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  tagImage: {
    width: 64,
    height: 64,
  },
  gradient: {
    top: 0,
    bottom: 0,
    width: 28,
    position: "absolute",
    zIndex: 1,
  },
  leftGradient: {
    left: 0,
  },
  rightGradient: {
    right: 0,
  },
});
export default Filters;
