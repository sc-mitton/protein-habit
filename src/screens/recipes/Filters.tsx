import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import _ from "lodash";

import { Box, Button, Text } from "@components";
import { useRecipesScreenContext } from "./Context";
import { allFilters } from "@store/slices/recipesSlice";
import FilterButton from "./FilterButton";

const Filters = () => {
  const {
    selectedFilterTab,
    setSelectedFilterTab,
    setSelectedFilters,
    selectedFilters,
  } = useRecipesScreenContext();
  return (
    <Box>
      <Box
        style={styles.tabs}
        borderBottomWidth={1}
        borderColor="borderColor"
        marginBottom="s"
        marginHorizontal="nm"
        paddingHorizontal="m"
      >
        {Object.keys(allFilters).map((key) => (
          <Button key={key} onPress={() => setSelectedFilterTab(key as any)}>
            <Text
              fontSize={14}
              color={selectedFilterTab === key ? "primaryText" : "tertiaryText"}
            >
              {_.capitalize(key)}
            </Text>
          </Button>
        ))}
        {Object.keys(selectedFilters).length > 0 && (
          <Box flex={1} alignItems="flex-end" marginRight="xs">
            <Box>
              <Button
                onPress={() => setSelectedFilters({})}
                fontSize={14}
                paddingHorizontal="s"
                paddingVertical="none"
              >
                <Text accent color="primaryText" fontSize={13} variant="bold">
                  Clear
                </Text>
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {allFilters[selectedFilterTab].map((filter) => (
          <FilterButton key={filter} filter={filter} />
        ))}
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  filters: {
    gap: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tagImage: {
    width: 64,
    height: 64,
  },
});

export default Filters;
