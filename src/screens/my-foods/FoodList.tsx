import { Fragment } from "react";
import { ScrollView, StyleSheet, Platform, Dimensions } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@shopify/restyle";

import { Food, selectFoods } from "@store/slices/foodsSlice";
import { Box, Text } from "@components";
import { useAppSelector } from "@store/hooks";
import FoodItem from "./FoodItem";

const FoodList = ({
  onPress,
  selectedFoods,
}: {
  onPress: (food: Food) => void;
  selectedFoods: string[];
}) => {
  const foods = useAppSelector(selectFoods);
  const theme = useTheme();

  return (
    <Fragment>
      {foods.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {foods
            .filter((f) => !selectedFoods.some((sf) => sf === f.id))
            .map((food) => (
              <Animated.View layout={LinearTransition} key={food.id}>
                <FoodItem
                  key={food.id}
                  food={food}
                  onPress={() => onPress(food)}
                />
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
    </Fragment>
  );
};

export default FoodList;

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 14,
    minHeight: 250,
    paddingHorizontal: 6,
    paddingBottom: 36,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Platform.OS === "ios" ? 12 : 0,
  },
});
