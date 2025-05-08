import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import Reanimated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";
import { BlurView } from "expo-blur";

import { Theme } from "@theme";
import { bookmark } from "@assets/lotties";
import { BumpButton } from "./BumpButton";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";
import { Box } from "./base/Box";

interface Props {
  bookmarked: boolean;
  onPress: () => void;
  size?: number;
  useAccent?: boolean;
}

export interface BookmarkButtonRef {
  playForward: () => void;
  playBackward: () => void;
  reset: () => void;
}

const styles = StyleSheet.create({
  lottieBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.2,
  },
  lottie: {},
  back: {
    position: "absolute",
    top: -2,
    left: -2,
    bottom: -2,
    right: -2,
  },
});

export const BookmarkButton = forwardRef<BookmarkButtonRef, Props>(
  ({ size = 26, useAccent = false, ...rest }, ref) => {
    const [bookmarked, setBookmarked] = useState(rest.bookmarked);
    const bookmarkAnimation = useRef<LottieView>(null);
    const theme = useTheme<Theme>();
    const accent = useAppSelector(selectAccent);
    const primaryColor =
      useAccent && accent ? theme.colors[`${accent}`] : theme.colors.white;

    // Expose imperative API methods
    useImperativeHandle(ref, () => ({
      playForward: () => {
        bookmarkAnimation.current?.play();
      },
      playBackward: () => {
        bookmarkAnimation.current?.play(0, 0);
      },
      reset: () => {
        bookmarkAnimation.current?.reset();
      },
    }));

    // Stage in right position
    useEffect(() => {
      if (rest.bookmarked) {
        bookmarkAnimation.current?.play();
      } else {
        bookmarkAnimation.current?.play(0, 0);
      }
    }, []);

    const handleBookmark = () => {
      setBookmarked(!bookmarked);
      if (bookmarked) {
        bookmarkAnimation.current?.play(30, 0);
      } else {
        bookmarkAnimation.current?.play();
      }
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
            colorFilters={[
              {
                keypath: "bookmark",
                color: primaryColor,
              },
              {
                keypath: "bookmark fill",
                color: primaryColor,
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
                color: "transparent",
              },
              {
                keypath: "bookmark fill",
                color: "black",
              },
            ]}
            style={[styles.lottieBackground, { width: size, height: size }]}
          />
        </BumpButton>
      </Reanimated.View>
    );
  },
);
