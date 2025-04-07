import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { StyleSheet } from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import _ from "lodash";

import { Box, Button, Text } from "@components";
import { allFilters } from "@db/schema/enums";
import { useRecipesScreenContext } from "./Context";

const OFFSET_LEFT = 20;
const TAB_GAP = 16;

// Memoized Label component to prevent unnecessary re-renders
const Label = React.memo(
  ({ label, isSelected }: { label: string; isSelected: boolean }) => {
    const animation = useAnimatedStyle(() => ({
      opacity: withTiming(isSelected ? 1 : 0.3, { duration: 200 }),
    }));

    return (
      <Reanimated.View style={animation}>
        <Text fontSize={14}>{label}</Text>
      </Reanimated.View>
    );
  },
);

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const TagsTabButtons = (props: Props) => {
  const { selectedFilters, setSelectedFilters } = useRecipesScreenContext();

  const tabHeaderWidths = useRef<number[]>([]);
  const indicatorX = useSharedValue(OFFSET_LEFT);
  const indicatorWidth = useSharedValue(0);

  const filterKeys = useMemo(() => Object.keys(allFilters), []);

  const indicatorAnimation = useAnimatedStyle(() => {
    return {
      position: "absolute",
      bottom: 0,
      height: 3,
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorX.value }],
    };
  });

  // Calculate position using a worklet for better performance
  const calculatePosition = useCallback((newIndex: number) => {
    const newXPosition =
      OFFSET_LEFT +
      TAB_GAP * newIndex +
      tabHeaderWidths.current.reduce(
        (acc, curr, i) => (i < newIndex ? acc + curr : acc),
        0,
      );

    return {
      x: newXPosition,
      width: tabHeaderWidths.current[newIndex] || 0,
    };
  }, []);

  const handleClear = () => {
    setSelectedFilters({});
  };

  const handleTabPress = (index: number) => {
    props.onChange(index);
    const { x, width } = calculatePosition(index);
    indicatorWidth.value = withTiming(width, { duration: 300 });
    indicatorX.value = withTiming(x, { duration: 300 });
  };

  useEffect(() => {
    handleTabPress(props.value);
  }, [props.value]);

  return (
    <Box
      style={styles.tabs}
      borderBottomWidth={1}
      borderColor="borderColor"
      marginBottom="s"
    >
      {filterKeys.map((key, i) => (
        <Reanimated.View
          key={key}
          onLayout={(e) => {
            // Only update if width has changed
            const width = e.nativeEvent.layout.width;
            if (tabHeaderWidths.current[i] !== width) {
              tabHeaderWidths.current[i] = width;

              // Update indicator width if this is the selected tab
              if (props.value === i) {
                indicatorWidth.value = width;
              }
            }
          }}
        >
          <Button
            onPress={() => handleTabPress(i)}
            paddingHorizontal="xs"
            activeOpacity={1}
          >
            <Label label={_.capitalize(key)} isSelected={props.value === i} />
          </Button>
        </Reanimated.View>
      ))}

      {Object.keys(selectedFilters).length > 0 && (
        <Box flex={1} alignItems="flex-end" marginRight="m" paddingRight="xxs">
          <Box>
            <Button
              onPress={handleClear}
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

      <Reanimated.View style={indicatorAnimation}>
        <Box
          accent={true}
          style={StyleSheet.absoluteFill}
          backgroundColor="tertiaryText"
          borderTopLeftRadius="s"
          borderTopRightRadius="s"
        />
      </Reanimated.View>
    </Box>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: OFFSET_LEFT,
    gap: TAB_GAP,
  },
});

export default TagsTabButtons;
