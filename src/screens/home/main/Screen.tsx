import { useRef, useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import dayjs from "dayjs";
import { useTheme } from "@shopify/restyle";

import { Box, Text } from "@components";
import { HomeScreenProps } from "@types";
import { HomeMainProvider, useTabs } from "./tabsContext";
import Tabs from "./Tabs";
import DailyTotal from "./DailyTotal";
import TabButtons from "./TabButtons";
import { selectUserInfo } from "@store/slices/userSlice";
import { Theme } from "@theme";

import { useAppSelector } from "@store/hooks";
const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingTop: Platform.OS === "ios" ? 0 : 48,
  },
  back: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
  },
  gradient1: {
    position: "absolute",
    top: 24,
    left: 0,
    right: 0,
    height: 64,
    zIndex: 1,
  },
  gradient2: {
    transform: [{ translateY: 48 }],
    height: "60%",
    bottom: 0,
    position: "absolute",
    left: 0,
    right: 0,
  },
});

const AnimatedBox = Animated.createAnimatedComponent(Box);

const Header = ({
  setTopSectionSize,
  scrollY,
}: {
  scrollY: Animated.Value;
  setTopSectionSize: (size: number) => void;
}) => {
  const theme = useTheme<Theme>();
  const { name } = useAppSelector(selectUserInfo);

  const headerZIndex = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <AnimatedBox
      top={theme.spacing.statusBar + 16}
      zIndex={Platform.OS === "android" ? headerZIndex : 0}
      width={"100%"}
      position="absolute"
      onLayout={(event) => {
        setTopSectionSize(event.nativeEvent.layout.height);
      }}
    >
      <Box
        paddingTop={Platform.OS === "ios" ? "statusBar" : "none"}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="l"
      >
        <Box>
          <Text variant="bold">Welcome, {name}</Text>
          <Text color="tertiaryText">{dayjs().format("MMM D, YYYY")}</Text>
        </Box>
      </Box>
      <DailyTotal />
    </AnimatedBox>
  );
};

const HomeMain = (props: HomeScreenProps<"Main">) => {
  const theme = useTheme<Theme>();
  const { selectedTab } = useTabs();
  const scrollRef = useRef<ScrollView>(null);
  const [topSectionSize, setTopSectionSize] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [topSlop, setTopSlop] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }
    setTopSlop(-topSectionSize);
  }, [selectedTab]);

  useEffect(() => {
    setTopSlop(-topSectionSize);
  }, [topSectionSize]);

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingTop={Platform.OS === "ios" ? "statusBar" : "l"}
    >
      <LinearGradient
        colors={[theme.colors.mainBackground, theme.colors.transparentRGB]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient1}
        pointerEvents="none"
      />
      <Box
        backgroundColor="secondaryBackground"
        style={styles.back}
        paddingTop="statusBar"
      />
      <Header scrollY={scrollY} setTopSectionSize={setTopSectionSize} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scroll]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={selectedTab === 0}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        onScrollEndDrag={(e) => {
          if (Platform.OS === "android") {
            const currentOffset = e.nativeEvent.contentOffset.y;
            const threshold = topSectionSize / 2;

            // If we're scrolling down from the top
            if (currentOffset > 0 && currentOffset < topSectionSize) {
              // If we're more than halfway down, snap to bottom
              if (currentOffset >= threshold) {
                scrollRef.current?.scrollTo({
                  y: topSectionSize,
                  animated: true,
                });
              } else {
                // If we're less than halfway, snap back to top
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }
            }
            // If we're scrolling up from the bottom
            else if (currentOffset > topSectionSize) {
              // If we're more than halfway up, snap to top
              if (currentOffset <= topSectionSize + threshold) {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              } else {
                // If we're less than halfway up, snap back to bottom
                scrollRef.current?.scrollTo({
                  y: topSectionSize,
                  animated: true,
                });
              }
            }
          }
        }}
        hitSlop={{ top: topSlop }}
      >
        <AnimatedBox
          height={topSectionSize}
          pointerEvents="box-none"
          style={{
            opacity: scrollY.interpolate({
              inputRange: [0, 64],
              outputRange: [0, 1],
            }),
          }}
        >
          <LinearGradient
            colors={[
              theme.colors.transparentRGB,
              theme.colors.mainBackground,
              theme.colors.mainBackground,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.gradient2]}
          />
        </AnimatedBox>
        <TabButtons />
        <Tabs />
      </ScrollView>
    </Box>
  );
};

export default function HomeMainScreen(props: HomeScreenProps<"Main">) {
  return (
    <HomeMainProvider>
      <HomeMain {...props} />
    </HomeMainProvider>
  );
}
