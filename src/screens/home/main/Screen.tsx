import { useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";

import { Box, Text } from "@components";
import { BottomTabsScreenProps } from "@types";
import DailyTotal from "./DailyTotal";
import { selectUserInfo } from "@store/slices/userSlice";
import { Theme } from "@theme";
import { showBottomBar } from "@store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";
import Stats from "./Stats";
import Entries from "./Entries";
import Calendar from "./Calendar";

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  gradient: {
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  imageBlurCover: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});

const AnimatedBox = Animated.createAnimatedComponent(Box);

const SectionHeader = ({ title }: { title: string }) => (
  <Box>
    <Box
      padding="s"
      paddingTop="l"
      backgroundColor="mainBackground"
      paddingHorizontal="m"
      marginHorizontal="nm"
    >
      <Text color="tertiaryText">{title}</Text>
    </Box>
    <Box height={26}>
      <Box
        backgroundColor="secondaryBackground"
        width="100%"
        height={"100%"}
        zIndex={1}
        borderRadius="full"
      />
      <Box
        backgroundColor="mainBackground"
        style={[StyleSheet.absoluteFill, { transform: [{ translateX: -16 }] }]}
        height="50%"
        top={0}
        width="150%"
        zIndex={0}
      />
    </Box>
  </Box>
);

const HomeMain = (props: BottomTabsScreenProps<"Home">) => {
  const { name } = useAppSelector(selectUserInfo);
  const accentColor = useAppSelector(selectAccent);
  const theme = useTheme<Theme>();

  const [topSectionSize, setTopSectionSize] = useState(0);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const dispatch = useAppDispatch();
  const isScrolling = useRef(false);
  const lastOffsetY = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScrollBeginDrag = () => {
    isScrolling.current = true;
  };

  const handleScrollEndDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    isScrolling.current = false;

    if (event.nativeEvent.contentOffset.y < 100) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      setIsScrolledToTop(true);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    const diff = currentOffsetY - lastOffsetY.current;
    scrollY.setValue(currentOffsetY);

    if (currentOffsetY > 100) {
      setIsScrolledToTop(false);
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

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingTop={Platform.OS === "ios" ? "statusBar" : "l"}
    >
      <AnimatedBox
        pointerEvents="none"
        position="absolute"
        top={0}
        width="100%"
        height={topSectionSize * 2}
        style={{
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -topSectionSize],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        <LinearGradient
          colors={[theme.colors.transparentRGB, theme.colors.mainBackground]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.gradient, StyleSheet.absoluteFill]}
        />
        <LinearGradient
          colors={[
            accentColor
              ? theme.colors[`${accentColor}GradientStart`]
              : theme.colors.tertiaryText,
            accentColor
              ? theme.colors[`${accentColor}GradientEnd`]
              : theme.colors.quaternaryText,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.image, { opacity: 0.3 }]}
        />
      </AnimatedBox>
      <Box paddingTop={"l"}>
        <Box
          paddingTop={Platform.OS === "ios" ? "statusBar" : "none"}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="l"
        >
          <Box flex={1}>
            <Text variant="bold">Welcome, {name}</Text>
            <Text color="tertiaryText">{dayjs().format("MMM D, YYYY")}</Text>
          </Box>
          <AnimatedBox
            pointerEvents={isScrolledToTop ? "none" : "auto"}
            style={{
              opacity: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 1],
              }),
            }}
          >
            <DailyTotal fontSize="small" />
          </AnimatedBox>
        </Box>
        <AnimatedBox
          style={{
            transformOrigin: "top left",
            transform: [
              {
                scale: scrollY.interpolate({
                  inputRange: [-100, 0, 100],
                  outputRange: [1.05, 1, 0.9],
                  extrapolate: "clamp",
                }),
              },
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [1, 0],
              extrapolate: "clamp",
            }),
          }}
        >
          <Box
            position="absolute"
            paddingTop={"l"}
            onLayout={(event) => {
              setTopSectionSize(event.nativeEvent.layout.height);
            }}
          >
            <DailyTotal />
          </Box>
        </AnimatedBox>
      </Box>
      <AnimatedBox
        style={[
          {
            zIndex: scrollY.interpolate({
              inputRange: [0, 1],
              outputRange: [-1, 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <AnimatedBox
          position="absolute"
          top={0}
          left={0}
          right={0}
          zIndex={1}
          height={32}
          pointerEvents="none"
          style={{
            opacity: scrollY.interpolate({
              inputRange: [100, 200],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
          }}
        >
          <LinearGradient
            colors={[theme.colors.mainBackground, theme.colors.transparentRGB]}
            style={StyleSheet.absoluteFill}
          />
        </AnimatedBox>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scroll}
          stickyHeaderIndices={[0, 2, 4]}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onScroll={handleScroll}
          contentContainerStyle={{
            paddingTop: topSectionSize - 12,
            paddingBottom: 24,
          }}
        >
          <SectionHeader title="Summary" />
          <Stats />
          <SectionHeader title="Entries" />
          <Entries />
          <Box padding="s" paddingTop="l" backgroundColor="mainBackground">
            <Text color="tertiaryText">History</Text>
          </Box>
          <Calendar />
        </ScrollView>
      </AnimatedBox>
    </Box>
  );
};

export default HomeMain;
