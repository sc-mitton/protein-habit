import { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import Reanimated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";

import { Theme } from "@theme";
import { bookmark } from "@assets/lotties";
import { BumpButton } from "@components";

interface Props {
  bookmarked: boolean;
  onPress: () => void;
  size?: number;
}

const styles = StyleSheet.create({
  lottieBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.05,
  },
  lottie: {},
});

export const BookmarkButton = ({ size = 26, ...rest }: Props) => {
  const [bookmarked, setBookmarked] = useState(false);
  const bookmarkAnimation = useRef<LottieView>(null);
  const [firstRender, setFirstRender] = useState(true);
  const theme = useTheme<Theme>();

  useEffect(() => {
    setBookmarked(rest.bookmarked);
  }, [rest.bookmarked]);

  useEffect(() => {
    if (firstRender) return;

    if (bookmarked) {
      bookmarkAnimation.current?.play();
    } else {
      bookmarkAnimation.current?.play(30, 0);
    }
  }, [bookmarked]);

  // Make sure the animation is staged at the right frame
  useEffect(() => {
    if (!bookmarked) {
      bookmarkAnimation.current?.reset();
    } else {
      bookmarkAnimation.current?.play();
    }
  }, []);

  useEffect(() => setFirstRender(false), []);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    rest.onPress();
  };

  return (
    <Reanimated.View entering={FadeIn}>
      <BumpButton onPress={handleBookmark}>
        <LottieView
          source={bookmark}
          autoPlay={false}
          loop={false}
          ref={bookmarkAnimation}
          speed={firstRender && bookmarked ? 1000 : 1}
          colorFilters={[
            {
              keypath: "bookmark",
              color: theme.colors.white,
            },
            {
              keypath: "bookmark fill",
              color: theme.colors.white,
            },
          ]}
          style={[styles.lottie, { width: size, height: size }]}
        />
        <LottieView
          source={bookmark}
          autoPlay={true}
          loop={false}
          speed={1000}
          colorFilters={[
            {
              keypath: "bookmark",
              color: theme.colors.white,
            },
            {
              keypath: "bookmark fill",
              color: theme.colors.mainBackground,
            },
          ]}
          style={[styles.lottieBackground, { width: size, height: size }]}
        />
      </BumpButton>
    </Reanimated.View>
  );
};
