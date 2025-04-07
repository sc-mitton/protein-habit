import { useEffect, useRef, useState } from "react";
import { useTheme } from "@shopify/restyle";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { TouchableHighlight, StyleSheet } from "react-native";
import { Image } from "expo-image";

import { bookmark } from "@assets/lotties";
import { Box, BumpButton, Text } from "@components";
import { Recipe } from "@db/schema/types";
import { Theme } from "@theme";
import { RootStackParamList } from "@types";

const styles = StyleSheet.create({
  bookmarkButton: {
    position: "absolute",
    top: 10,
    right: 10,
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
  lottie: {
    width: 26,
    height: 26,
  },
  titleContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  masonTyle: {
    flex: 1,
    height: 160 + Math.random() * 60,
  },
});

interface Props {
  recipe: Recipe & {
    proteinPerServing: number;
  };
}

const RecipeCard = (props: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme<Theme>();
  const [firstRender, setFirstRender] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const bookmarkAnimation = useRef<LottieView>(null);

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const handlePress = () => {
    navigation.navigate("RecipeDetail", { recipe: props.recipe });
  };

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
    <Box style={styles.masonTyle} margin={"s"}>
      <TouchableHighlight
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={0.97}
        underlayColor={theme.colors.primaryText}
      >
        <BumpButton style={styles.bookmarkButton} onPress={handleBookmark}>
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
        </BumpButton>
        <Image
          source={props.recipe.thumbnail}
          contentFit="cover"
          transition={100}
        />
        <Box style={styles.titleContainer}>
          <Text color="white">{props.recipe.title}</Text>
        </Box>
      </TouchableHighlight>
    </Box>
  );
};

export default RecipeCard;
