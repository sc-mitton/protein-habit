import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { StyleSheet } from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import _ from "lodash";

import { Box, Button, Text } from "@components";
import { allFilters } from "@store/slices/recipesSlice";
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

// Define proper types for the component props
type TagsTabButtonsProps = {
  value: number;
  onChange: (index: number) => void;
};

const TagsTabButtons = ({ value, onChange }: TagsTabButtonsProps) => {
  const { selectedFilters, setSelectedFilters } = useRecipesScreenContext();

  const [index, setIndex] = useState(value);

  // Use a more efficient way to track tab widths
  const tabHeaderWidths = useRef<number[]>([]);
  const indicatorX = useSharedValue(OFFSET_LEFT);
  const indicatorWidth = useSharedValue(0);

  // Memoize the filter keys to prevent recalculation
  const filterKeys = useMemo(() => Object.keys(allFilters), []);

  // Animated styles for the indicator
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

  // Update indicator position when index changes
  useEffect(() => {
    const { x, width } = calculatePosition(index);

    // Use spring animation for smoother transitions
    indicatorWidth.value = withTiming(width, { duration: 500 });
    indicatorX.value = withTiming(x, { duration: 500 });
  }, [index, calculatePosition]);

  // Notify parent component of index change
  useEffect(() => {
    onChange(index);
  }, [index, onChange]);

  // Handle tab press with memoized callback
  const handleTabPress = useCallback((i: number) => {
    setIndex(i);
  }, []);

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
              if (index === i) {
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
            <Label label={_.capitalize(key)} isSelected={index === i} />
          </Button>
        </Reanimated.View>
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
