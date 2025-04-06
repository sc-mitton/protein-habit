import React, { useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Image,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { MasonryFlashList } from "@shopify/flash-list";

import { Box } from "@components";
import { RecipesScreenProps } from "@types";
import { useAppDispatch } from "@store/hooks";
import { showBottomBar } from "@store/slices/uiSlice";
import Filters from "./Filters";
import { useRecipesScreenContext } from "./Context";
import images from "./images";

type Props = RecipesScreenProps<"Explore">;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  image: {
    width: 32,
    height: 32,
  },
  recipeBox: {
    flex: 1,
    margin: 8,
  },
  masonTyle: {
    flex: 1,
  },
});

const DATA = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  height: Math.floor(Math.random() * 60) + 160,
}));

const ExploreScreen: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const lastOffsetY = useRef(0);
  const isScrolling = useRef(false);
  const { selectedFilters, searchQuery } = useRecipesScreenContext();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(showBottomBar(true));
    };
  }, []);

  useEffect(() => {
    if (isHeaderCollapsed && Object.keys(selectedFilters).length > 0) {
      props.navigation.setOptions({
        headerTitle: () => (
          <Animated.View entering={FadeIn}>
            <Box flexDirection="row" gap="nl" marginRight="nm" marginBottom="m">
              {Object.keys(selectedFilters).map((filter) => (
                <Box
                  key={filter}
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  marginLeft="nm"
                  backgroundColor="primaryButton"
                  borderColor="matchBlurBackground"
                  borderWidth={1.5}
                  padding="xxs"
                >
                  <Image
                    source={images[(selectedFilters as any)[filter]]}
                    style={styles.image}
                  />
                </Box>
              ))}
            </Box>
          </Animated.View>
        ),
      });
    } else {
      props.navigation.setOptions({
        headerTitle: "Recipes",
      });
    }
  }, [isHeaderCollapsed]);

  const handleScrollBeginDrag = () => {
    isScrolling.current = true;
  };

  const handleScrollEndDrag = () => {
    isScrolling.current = false;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const diff = currentOffsetY - lastOffsetY.current;

    if (currentOffsetY >= -120) {
      setIsHeaderCollapsed(true);
    } else {
      setIsHeaderCollapsed(false);
    }

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

  const renderItem = ({ item }: { item: (typeof DATA)[number] }) => (
    <Animated.View layout={LinearTransition} style={styles.masonTyle}>
      <Box
        borderRadius="l"
        height={item.height}
        margin={"s"}
        shadowColor="foodItemShadow"
        shadowOpacity={0.1}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={2}
        elevation={5}
        backgroundColor="primaryButton"
      >
        <Box
          flex={1}
          shadowColor="foodItemShadow"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          elevation={12}
        ></Box>
      </Box>
    </Animated.View>
  );

  const ListHeaderComponent = () => (!searchQuery ? <Filters /> : null);

  return (
    <MasonryFlashList
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
      data={DATA}
      renderItem={renderItem}
      keyExtractor={(_, index) => `recipe-${index}`}
      ListHeaderComponent={ListHeaderComponent}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      onScroll={handleScroll}
      numColumns={2}
      estimatedItemSize={200}
      scrollEventThrottle={16}
    />
  );
};

export default ExploreScreen;
