import { ScrollView, StyleSheet, Platform } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@shopify/restyle";

import { selectFoods } from "@store/slices/foodsSlice";
import { Box, Text } from "@components";
import { useAppSelector } from "@store/hooks";
import FoodItem from "./FoodItem";
import { useMyFoods } from "./context";

const FoodList = () => {
  const { searchString, selectedTags, selectedFoods, scrolling } = useMyFoods();
  const foods = useAppSelector(selectFoods);
  const theme = useTheme();

  return (
    <Animated.View
      layout={LinearTransition.springify().mass(0.5).damping(15).stiffness(100)}
    >
      {foods.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={() => {
            scrolling.current = true;
          }}
          onScrollEndDrag={() => {
            scrolling.current = false;
          }}
        >
          {foods
            .filter((f) => !selectedFoods.some((sf) => sf.food.id === f.id))
            .filter((f) =>
              selectedTags.length > 0
                ? selectedTags.some((t) => f.tags?.some((ft) => ft === t))
                : true,
            )
            .filter((f) =>
              searchString
                ? f.name.toLowerCase().includes(searchString.toLowerCase())
                : true,
            )
            .map((food) => (
              <Animated.View layout={LinearTransition} key={food.id}>
                <FoodItem key={food.id} food={food} />
              </Animated.View>
            ))}
        </ScrollView>
      ) : (
        <Box
          justifyContent="flex-start"
          alignItems="center"
          gap="l"
          paddingVertical="xxxl"
          width="100%"
        >
          <Box
            borderWidth={1}
            borderColor="borderColor"
            borderRadius="full"
            padding="sm"
          >
            <MaterialCommunityIcons
              name="food-steak"
              size={40}
              color={theme.colors.primaryText}
            />
          </Box>
          <Box width={"80%"}>
            <Text variant="body" color="tertiaryText" textAlign="center">
              Add your most common foods to quickly add their protein in the
              future
            </Text>
          </Box>
        </Box>
      )}
    </Animated.View>
  );
};

export default FoodList;

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 14,
    minHeight: 275,
    paddingHorizontal: 6,
    paddingBottom: 36,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Platform.OS === "ios" ? 12 : 0,
  },
});
