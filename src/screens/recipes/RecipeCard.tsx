import { useEffect, useRef, useState } from "react";
import { useTheme } from "@shopify/restyle";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableHighlight, StyleSheet } from "react-native";
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
  BookmarkButtonRef,
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
    top: 6,
    right: 6,
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme<Theme>();
  const generator = seedrandom(props.index.toString());
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlaceholderBox, setShowPlaceholderBox] = useState(false);
  const bookmarkAnimationRef = useRef<BookmarkButtonRef>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (isBookmarked) {
      bookmarkAnimationRef.current?.playForward();
    } else {
      bookmarkAnimationRef.current?.playBackward();
    }
  }, [isBookmarked]);

  useEffect(() => {
    navigation.addListener("focus", (state) => setFocused(true));
    navigation.addListener("blur", (state) => setFocused(false));
  }, [props.recipe]);

  useEffect(() => {
    if (focused && !isBookmarked) {
      bookmarkAnimationRef.current?.playBackward();
    }
  }, [focused, isBookmarked]);

  const handleBookmark = () => {
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
    <Box
      margin={"s"}
      height={220 + Number(generator()) * 60}
      shadowColor="defaultShadow"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.1}
      shadowRadius={4}
    >
      <TouchableHighlight
        style={[styles.touchable]}
        onPress={handlePress}
        activeOpacity={0.9}
        underlayColor={theme.colors.primaryText}
      >
        <Box flex={1}>
          {isLoaded && (
            <Box style={styles.bookmarkButton}>
              <BookmarkButton
                onPress={handleBookmark}
                bookmarked={isBookmarked}
                ref={bookmarkAnimationRef}
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
          {showPlaceholderBox && (
            <Reanimated.View
              style={[StyleSheet.absoluteFill]}
              exiting={FadeOut}
              entering={FadeIn}
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
            onError={() => setShowPlaceholderBox(true)}
          />
        </Box>
      </TouchableHighlight>
      <Box marginTop="sm" gap="s" marginLeft="xs">
        <PulseText pulsing={!isLoaded}>
          <Text fontSize={13} lineHeight={13}>
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
        <PulseText pulsing={!isLoaded}>
          <Box flexDirection="row" gap="s">
            <Text fontSize={12} lineHeight={12} color="secondaryText">
              {`${props.recipe?.meta.proteinPerServing}g protein`}
              {props.recipe?.meta.caloriesPerServing &&
                ` • ${props.recipe?.meta.caloriesPerServing} kcal`}
            </Text>
          </Box>
        </PulseText>
      </Box>
    </Box>
  );
};

export default RecipeCard;
