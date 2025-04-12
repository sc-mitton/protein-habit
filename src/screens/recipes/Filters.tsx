import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";

import { Box, LinearGradientEdges } from "@components";
import FilterButton from "./FilterButton";
import TabButtons from "./TabButtons";
import { WIDTH } from "./FilterButton";
import { useRecipesScreenContext } from "./Context";

const Filters = () => {
  const ref = useRef<FlatList>(null);
  const currentSectionIndex = useRef(0);
  const isDragging = useRef(false);
  const [selectedFilterTab, setSelectedFilterTab] = useState(0);
  const { filterOptions } = useRecipesScreenContext();

  // The indices in the flatlist of the first item of each tag type section
  const sectionIndexes = useMemo(() => {
    return Object.keys(filterOptions).reduce(
      (acc, key, i) => {
        acc.push(
          filterOptions[key as keyof typeof filterOptions].length +
            acc[acc.length - 1] || 0,
        );
        return acc;
      },
      [0] as number[],
    );
  }, [filterOptions]);

  useEffect(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    if (isDragging.current) return;
    if (Object.keys(filterOptions).length === 0) return;
    ref.current?.scrollToIndex({
      index: sectionIndexes[selectedFilterTab],
      animated: true,
      viewOffset: 12,
    });
  }, [selectedFilterTab]);

  return (
    <Box marginHorizontal="nm">
      <TabButtons value={selectedFilterTab} onChange={setSelectedFilterTab} />
      <View>
        <LinearGradientEdges height={80} />
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
          snapToInterval={WIDTH}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={({ viewableItems, changed }) => {
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
            if (changed) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
          keyExtractor={(item) => item}
          data={Object.values(filterOptions).flat()}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => <FilterButton filter={item} />}
        />
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  filters: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tagImage: {
    width: 64,
    height: 64,
  },
});
export default Filters;
