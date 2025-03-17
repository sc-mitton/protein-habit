import { useEffect } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import { selectFoods } from "@store/slices/foodsSlice";
import { Box } from "@components";
import { HomeScreenProps } from "@types";
import { useAppSelector } from "@store/hooks";
import FoodList from "./FoodList";
import { MyFoodsProvider, useMyFoods } from "./context";
import Header from "./Header";
import SelectedFoods from "./SelectedFoods";

const MyFoods = (props: HomeScreenProps<"MyFoods">) => {
  const foods = useAppSelector(selectFoods);

  const { selectedFoods, setSelectedFoods } = useMyFoods();

  useEffect(() => {
    if (props.route.params?.entry) {
      setSelectedFoods([
        {
          food: foods.find(
            (food) => food.id === props.route.params?.entry?.food,
          )!,
          amount:
            props.route.params?.entry?.grams! /
            foods.find((food) => food.id === props.route.params?.entry?.food)!
              .protein,
        },
      ]);
    }
  }, [props.route.params?.entry]);

  return (
    <Box
      flex={1}
      backgroundColor="modalBackground"
      paddingTop={Platform.OS === "ios" ? "none" : "xl"}
    >
      {Platform.OS === "ios" && (
        <StatusBar
          style={"light"}
          backgroundColor={"transparent"}
          translucent
        />
      )}
      <Header />
      <Box>
        {!props.route.params?.entry && (
          <Box
            height={selectedFoods.length > 0 ? 275 : "auto"}
            backgroundColor="modalBackground"
          >
            <FoodList
              selectedFoods={selectedFoods.map((food) => food.food.id)}
              onPress={(food) => {
                setSelectedFoods([...selectedFoods, { food, amount: 1 }]);
              }}
            />
          </Box>
        )}
        <SelectedFoods {...props} />
      </Box>
    </Box>
  );
};

export default function (props: HomeScreenProps<"MyFoods">) {
  return (
    <MyFoodsProvider>
      <MyFoods {...props} />
    </MyFoodsProvider>
  );
}
