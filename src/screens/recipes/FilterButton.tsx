import React, { useMemo, useState, useEffect } from "react";
import { Image, StyleSheet, TouchableHighlight } from "react-native";
import { useTheme } from "@shopify/restyle";
import _ from "lodash";
import { Box, Text } from "@components";
import { useRecipesScreenContext } from "./Context";
import { useAppSelector } from "@store/hooks";
import { allFilters } from "@store/slices/recipesSlice";
import { selectAccent } from "@store/slices/uiSlice";
import images from "./images";
const styles = StyleSheet.create({
  tagImage: {
    width: 38,
    height: 38,
    borderRadius: 12,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    opacity: 0.85,
  },
  gradient: {
    zIndex: -1,
    borderRadius: 12,
  },
  touchable: {
    borderRadius: 13,
  },
  box: {
    borderRadius: 12,
  },
  filterText: {
    position: "absolute",
    bottom: 12,
  },
});

const FilterButton = ({ filter }: { filter: string }) => {
  const theme = useTheme();
  const accent = useAppSelector(selectAccent);
  const { selectedFilters, setSelectedFilters } = useRecipesScreenContext();
  const filterType = useMemo(() => {
    return Object.keys(allFilters).find((key: any) =>
      (allFilters as any)[key].includes(filter),
    ) as keyof typeof allFilters;
  }, [filter]);

  const [isSelected, setIsSelected] = useState<boolean>(
    selectedFilters?.[filterType] === filter,
  );

  useEffect(() => {
    setIsSelected(selectedFilters?.[filterType] === filter);
  }, [selectedFilters, filter, filterType]);

  return (
    <Box alignItems="center" gap="xxs">
      <TouchableHighlight
        underlayColor={theme.colors.primaryText}
        activeOpacity={0.97}
        style={styles.touchable}
        onPress={() => {
          setSelectedFilters((prev) => {
            return {
              ...prev,
              [filterType]: isSelected ? undefined : filter,
            };
          });
        }}
      >
        <Box
          backgroundColor={"mainBackground"}
          borderColor={isSelected ? accent || "secondaryText" : "primaryButton"}
          borderWidth={1.5}
          shadowColor={isSelected ? accent || "quaternaryText" : "transparent"}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={1}
          style={styles.box}
          padding="s"
        >
          <Image source={images[filter]} style={styles.tagImage} />
        </Box>
      </TouchableHighlight>
      <Text fontSize={12} color="secondaryText" style={styles.filterText}>
        {_.capitalize(filter.replace("_", " "))}
      </Text>
    </Box>
  );
};

export default FilterButton;
