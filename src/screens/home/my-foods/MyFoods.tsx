import { useEffect } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";

import { selectFoods } from "@store/slices/foodsSlice";
import { Box } from "@components";
import { RootScreenProps } from "@types";
import { useAppSelector } from "@store/hooks";
import FoodList from "./FoodList";
import { MyFoodsProvider, useMyFoods } from "./context";
import Header from "./Header";
import SelectedFoods from "./SelectedFoods";

const MyFoods = (props: RootScreenProps<"MyFoodsModal">) => {
  const foods = useAppSelector(selectFoods);

  const { selectedFoods, setSelectedFoods } = useMyFoods();

  useEffect(() => {
    if (props.route.params?.entry) {
      setSelectedFoods([
        {
          food: foods.find(
            (food) => food.id === props.route.params?.entry?.food,
          )!,
          amount: Math.round(
            props.route.params?.entry?.grams! /
              foods.find((food) => food.id === props.route.params?.entry?.food)!
                .protein,
          ),
        },
      ]);
    }
  }, [props.route.params?.entry]);

  return (
    <Box
      flex={1}
      backgroundColor={"mainBackground"}
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
      <Box flex={1} flexGrow={1}>
        {!props.route.params?.entry && (
          <Box
            height={
              selectedFoods.length > 0
                ? Device.osName === "iPadOS"
                  ? 190
                  : 280
                : "auto"
            }
            backgroundColor={"mainBackground"}
          >
            <FoodList />
          </Box>
        )}
        <SelectedFoods {...props} />
      </Box>
    </Box>
  );
};

export default function MyFoodsWrapper(props: RootScreenProps<"MyFoodsModal">) {
  return (
    <MyFoodsProvider>
      <MyFoods {...props} />
    </MyFoodsProvider>
  );
}
