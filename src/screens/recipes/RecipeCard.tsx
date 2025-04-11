import { useEffect, useRef, useState } from "react";
import { useTheme } from "@shopify/restyle";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { TouchableHighlight, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Reanimated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import seedrandom from "seedrandom";
import _ from "lodash";
import { bookmark } from "@assets/lotties";
import { Box, BumpButton, Text, PulseText } from "@components";
import { RecipeWithAssociations } from "@db/schema/types";
import { Theme } from "@theme";
import { RootStackParamList } from "@types";
import { capitalize } from "@utils";

const styles = StyleSheet.create({
  bookmarkButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  touchable: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardBox: {
    flex: 1,
    borderRadius: 12,
  },
  lottie: {
    width: 26,
    height: 26,
  },
  lottieBackground: {
    width: 26,
    height: 26,
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.05,
  },
  titleContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

interface Props {
  recipe?: RecipeWithAssociations;
  index: number;
}

const RecipeCard = (props: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme<Theme>();
  const [firstRender, setFirstRender] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const bookmarkAnimation = useRef<LottieView>(null);
  const generator = seedrandom(props.index.toString());
  const [isLoaded, setIsLoaded] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const handlePress = () => {
    if (!props.recipe) return;
    navigation.navigate("RecipeDetail", { recipe: props.recipe });
  };

  const skeletonAnimation = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.25, { duration: 1000 }),
      ),
      -1,
      true,
    ),
  }));

  useEffect(() => {
    if (firstRender) return;

    if (isBookmarked) {
      bookmarkAnimation.current?.play();
    } else {
      bookmarkAnimation.current?.play(30, 0);
    }
  }, [isBookmarked]);

  // Make sure the animation is staged at the right frame
  useEffect(() => {
    if (!isBookmarked) {
      bookmarkAnimation.current?.reset();
    } else {
      bookmarkAnimation.current?.play();
    }
  }, []);

  useEffect(() => setFirstRender(false), []);

  return (
    <Box margin={"s"} height={220 + Number(generator()) * 60}>
      <TouchableHighlight
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={0.9}
        underlayColor={theme.colors.primaryText}
      >
        <Box flex={1}>
          {isLoaded && (
            <Reanimated.View style={styles.bookmarkButton} entering={FadeIn}>
              <BumpButton onPress={handleBookmark}>
                <LottieView
                  source={bookmark}
                  autoPlay={false}
                  loop={false}
                  ref={bookmarkAnimation}
                  speed={firstRender && isBookmarked ? 1000 : 1}
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
                  style={styles.lottie}
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
                  style={styles.lottieBackground}
                />
              </BumpButton>
            </Reanimated.View>
          )}
          {!isLoaded && (
            <Reanimated.View
              style={[StyleSheet.absoluteFill, skeletonAnimation]}
              exiting={FadeOut}
            >
              <Box flex={1} backgroundColor="primaryButton" />
            </Reanimated.View>
          )}
          <Image
            source={{
              uri: props.recipe
                ? "https://protein-count-recipe-thumbnails.s3.us-west-1.amazonaws.com/a3d4e7c9-4f85-4d8e-bfde-1e3f6d8b0986.jpg"
                : "",
            }}
            onLoadEnd={() => props.recipe && setIsLoaded(true)}
            style={styles.image}
            transition={100}
          />
        </Box>
      </TouchableHighlight>
      <Box marginTop="s" gap="s">
        <PulseText pulsing={!isLoaded}>
          <Text fontSize={13} lineHeight={13} variant="bold">
            {_.truncate(
              props.recipe?.title
                .split(" ")
                .map((word) => capitalize(word))
                .join(" "),
              {
                length: 25,
              },
            )}
          </Text>
        </PulseText>
        <PulseText pulsing={!isLoaded} width={100}>
          <Text fontSize={13} lineHeight={13} color="secondaryText">
            {`${props.recipe?.meta.proteinPerServing}g protein`}
          </Text>
        </PulseText>
      </Box>
    </Box>
  );
};

export default RecipeCard;
