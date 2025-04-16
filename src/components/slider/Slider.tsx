import * as Haptics from "expo-haptics";

import { useState, useMemo, memo } from "react";
import { View, FlatList, TextStyle, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Tick } from "./Tick";
import { number } from "zod";

interface SliderProps {
  defaultValue: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  tickColor?: string;
  // Must be an odd number
  numberOfVisibleTicks?: number;
  fontStyle?: TextStyle | TextStyle[];
}

export const Slider = (props: SliderProps) => {
  const {
    defaultValue,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    tickColor = "black",
    numberOfVisibleTicks = 11,
    fontStyle = { fontSize: 18, color: "black" },
  } = props;

  const [itemWidth, setItemWidth] = useState(0);
  const scrollProgress = useSharedValue(0);

  const data = useMemo(() => {
    return Array.from(
      { length: max - min / step + 1 + (max - min) },
      (_, index) => {
        return {
          value: min + index * step,
          index,
        };
      },
    );
  }, [min, max, step]);

  return (
    <View
      onLayout={(event) => {
        setItemWidth(
          Math.round(event.nativeEvent.layout.width / numberOfVisibleTicks),
        );
      }}
    >
      {itemWidth !== 0 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: itemWidth * numberOfVisibleTicks }}
          getItemLayout={(data, index) => ({
            length: itemWidth,
            index,
            offset: itemWidth * index,
          })}
          initialScrollIndex={(defaultValue - min) / step}
          contentContainerStyle={[
            {
              paddingLeft:
                (itemWidth * numberOfVisibleTicks) / 2 - itemWidth * 0.5,
              paddingRight:
                (itemWidth * numberOfVisibleTicks) / 2 - itemWidth * 0.5,
            },
          ]}
          data={data}
          onMomentumScrollEnd={(e) => {
            const centerIndex = Math.round(
              e.nativeEvent.contentOffset.x / itemWidth,
            );
            onChange(centerIndex + min);
          }}
          onScroll={({ nativeEvent }) => {
            scrollProgress.value = nativeEvent.contentOffset.x;
          }}
          onViewableItemsChanged={() => {
            Haptics.selectionAsync();
          }}
          scrollEventThrottle={16}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            minimumViewTime: 100,
          }}
          snapToAlignment="start"
          snapToInterval={itemWidth}
          maxToRenderPerBatch={numberOfVisibleTicks}
          windowSize={numberOfVisibleTicks}
          removeClippedSubviews={true}
          initialNumToRender={numberOfVisibleTicks}
          renderItem={({ item }) => (
            <Tick
              item={item}
              fontStyle={fontStyle as TextStyle}
              scrollProgress={scrollProgress}
              width={itemWidth}
              backgroundColor={tickColor}
            />
          )}
        />
      )}
    </View>
  );
};

export default memo(Slider);
