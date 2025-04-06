import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Box } from "@components";
import { allFilters } from "@store/slices/recipesSlice";
import FilterButton from "./FilterButton";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@theme";
import TabButtons from "./TabButtons";

const Filters = () => {
  const [selectedFilterTab, setSelectedFilterTab] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<keyof typeof allFilters>(
    Object.keys(allFilters)[0] as any,
  );
  const theme = useTheme<Theme>();

  useEffect(() => {
    setSelectedFilter(Object.keys(allFilters)[selectedFilterTab] as any);
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {allFilters[selectedFilter].map((filter) => (
            <FilterButton key={filter} filter={filter} />
          ))}
        </ScrollView>
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
