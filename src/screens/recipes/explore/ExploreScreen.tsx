import React, { useEffect, useRef } from "react";
import { RecipesScreenProps } from "@types";
import { Box } from "@components";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { useAppDispatch } from "@store/hooks";
import { showBottomBar } from "@store/slices/uiSlice";

type Props = RecipesScreenProps<"Explore">;

const styles = StyleSheet.create({
  scrollContent: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

const ExploreScreen: React.FC<Props> = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const lastOffsetY = useRef(0);
  const isScrolling = useRef(false);
  useEffect(() => {
    return () => {
      dispatch(showBottomBar(true));
    };
  }, []);

  const handleScrollBeginDrag = () => {
    isScrolling.current = true;
  };

  const handleScrollEndDrag = () => {
    isScrolling.current = false;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const diff = currentOffsetY - lastOffsetY.current;

    if (isScrolling.current) {
      const direction = diff > 0 ? "down" : "up";
      if (direction === "down") {
        dispatch(showBottomBar(false));
      } else {
        dispatch(showBottomBar(true));
      }
    }
    lastOffsetY.current = currentOffsetY;
  };

  return (
    <View>
      <ScrollView
        style={[{ backgroundColor: theme.colors.matchBlurBackground }]}
        contentContainerStyle={[styles.scrollContent]}
        contentInsetAdjustmentBehavior="automatic"
        scrollEventThrottle={16}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onScrollToTop={() => {
          dispatch(showBottomBar(true));
        }}
        onScroll={handleScroll}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <Box
            key={`recipe-${index}`}
            borderRadius="m"
            height={100}
            width="100%"
            backgroundColor="secondaryCardBackground"
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;
