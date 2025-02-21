import * as Haptics from "expo-haptics";

import { useState, useMemo, memo } from "react";
import { View, FlatList, TextStyle } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Tick } from "./Tick";

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

  const [containerWidth, setContainerWidth] = useState(0);
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
        setContainerWidth(event.nativeEvent.layout.width);
      }}
    >
      {containerWidth !== 0 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: containerWidth / numberOfVisibleTicks,
            offset:
              (containerWidth / numberOfVisibleTicks) * index +
              (containerWidth / 2 -
                (containerWidth / numberOfVisibleTicks) * 0.5),
            index,
          })}
          initialScrollIndex={
            (defaultValue - min) / step - Math.floor(numberOfVisibleTicks / 2)
          }
          contentContainerStyle={[
            {
              paddingLeft:
                containerWidth / 2 -
                (containerWidth / numberOfVisibleTicks) * 0.5,
              paddingRight:
                containerWidth / 2 -
                (containerWidth / numberOfVisibleTicks) * 0.5,
            },
          ]}
          data={data}
          onMomentumScrollEnd={(e) => {
            const centerIndex = Math.round(
              e.nativeEvent.contentOffset.x /
                (containerWidth / numberOfVisibleTicks),
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
          snapToStart
          snapToInterval={containerWidth / numberOfVisibleTicks}
          maxToRenderPerBatch={numberOfVisibleTicks}
          windowSize={numberOfVisibleTicks}
          removeClippedSubviews={true}
          initialNumToRender={numberOfVisibleTicks}
          renderItem={({ item }) => (
            <Tick
              item={item}
              fontStyle={fontStyle as TextStyle}
              scrollProgress={scrollProgress}
              width={containerWidth / numberOfVisibleTicks}
              backgroundColor={tickColor}
            />
          )}
        />
      )}
    </View>
  );
};

export default memo(Slider);
