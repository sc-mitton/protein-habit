import { useEffect, useRef, useState } from "react";
import { useTheme } from "@shopify/restyle";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { TouchableHighlight, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
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
import {
  Box,
  Text,
  PulseText,
  BookmarkButton,
  RecipeThumbnail,
} from "@components";
import { RecipeWithAssociations } from "@db/schema/types";
import { Theme } from "@theme";
import { RootStackParamList } from "@types";
import { capitalize } from "@utils";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { selectIsBookmarked, removeRecipe } from "@store/slices/bookmarksSlice";

const AnimatedRecipeThumbnail =
  Animated.createAnimatedComponent(RecipeThumbnail);

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
  },
  cardBox: {
    flex: 1,
    borderRadius: 12,
  },
  titleContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});

interface Props {
  recipe?: RecipeWithAssociations;
  index: number;
}

const RecipeCard = (props: Props) => {
  const dispatch = useAppDispatch();
  const isBookmarked = useAppSelector((state) =>
    selectIsBookmarked(state, props.recipe?.id),
  );
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme<Theme>();
  const generator = seedrandom(props.index.toString());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setBookmarked(isBookmarked);
    });
  }, [navigation]);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (isBookmarked && props.recipe) {
      dispatch(
        removeRecipe({
          recipeId: props.recipe!.id,
        }),
      );
    } else if (props.recipe) {
      navigation.navigate("BookmarkModal", { recipe: props.recipe.id });
    }
  };

  const handlePress = () => {
    if (!props.recipe) return;
    navigation.navigate("RecipeDetail", { recipe: props.recipe.id });
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
            <Box style={styles.bookmarkButton}>
              <BookmarkButton
                onPress={handleBookmark}
                bookmarked={bookmarked}
              />
            </Box>
          )}
          {!isLoaded && (
            <Reanimated.View
              style={[StyleSheet.absoluteFill, skeletonAnimation]}
              exiting={FadeOut}
            >
              <Box
                flex={1}
                backgroundColor="primaryButton"
                borderRadius={"l"}
              />
            </Reanimated.View>
          )}
          <AnimatedRecipeThumbnail
            // sharedTransitionTag={`image${props.recipe?.id}`}
            source={{ uri: props.recipe?.thumbnail }}
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
