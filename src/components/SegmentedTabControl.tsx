import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Animated, TouchableOpacity } from "react-native";
import { Box } from "./base/Box";
import { Text } from "./base/Text";

type TabOption<T extends string> = {
  label: string;
  value: T;
};

type SegmentedTabControlProps<T extends string> = {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  defaultIndex?: number;
};

export const SegmentedTabControl = <T extends string>({
  options,
  value,
  onChange,
  defaultIndex = 0,
}: SegmentedTabControlProps<T>) => {
  const [index, setIndex] = useState(defaultIndex);
  const left = useRef(new Animated.Value(0)).current;
  const tabsTrackWidth = useRef(0);

  useEffect(() => {
    Animated.spring(left, {
      toValue: (tabsTrackWidth.current / options.length) * index,
      useNativeDriver: false,
      mass: 1,
      stiffness: 200,
      damping: 25,
    }).start();
  }, [value]);

  useEffect(() => {
    onChange(options[index].value);
  }, [index]);

  return (
    <Box backgroundColor="segmentedTab" borderRadius="m">
      <Box
        margin="xs"
        flexDirection="row"
        onLayout={(event) => {
          tabsTrackWidth.current = event.nativeEvent.layout.width;
        }}
      >
        <Animated.View
          style={[
            styles.indicatorContainer,
            { width: `${100 / options.length}%` },
            { left: left },
          ]}
        >
          <Box backgroundColor="segmentedTabControl" style={styles.indicator} />
        </Animated.View>
        {options.map((option, i) => (
          <TouchableOpacity key={option.value} onPress={() => setIndex(i)}>
            <Box marginHorizontal="m" marginVertical="xxs">
              <Text fontSize={14}>{option.label}</Text>
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    height: "100%",
    position: "absolute",
    borderRadius: 6,
    overflow: "hidden",
    zIndex: -1,
  },
  button: {
    zIndex: 1,
  },
  indicator: {
    height: "100%",
    width: "100%",
  },
});
