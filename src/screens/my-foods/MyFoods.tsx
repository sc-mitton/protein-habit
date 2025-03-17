import { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, Platform } from "react-native";
import { Plus, Minus } from "geist-native-icons";
import { StatusBar } from "expo-status-bar";
import Animated, {
  LinearTransition,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { selectFoods, removeTag } from "@store/slices/foodsSlice";
import { Box, Button, Icon, Text } from "@components";
import { HomeScreenProps } from "@types";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addEntry, updateEntry } from "@store/slices/proteinSlice";
import FoodList from "./FoodList";
import { MyFoodsProvider, useMyFoods } from "./context";
import Header from "./Header";

const styles = StyleSheet.create({
  selectedItemsScroll: {
    height: "auto",
  },
});

const MyFoods = (props: HomeScreenProps<"MyFoods">) => {
  const dispatch = useAppDispatch();
  const foods = useAppSelector(selectFoods);

  const { selectedFoods, setSelectedFoods, day } = useMyFoods();

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

  const handleSave = () => {
    if (props.route.params?.entry) {
      dispatch(
        updateEntry({
          ...props.route.params.entry,
          food: selectedFoods[0].food.id,
          grams: selectedFoods[0].food.protein * selectedFoods[0].amount,
        }),
      );
    } else {
      for (let i = 0; i < selectedFoods.length; i++) {
        dispatch(
          addEntry({
            grams: selectedFoods[i].food.protein * selectedFoods[i].amount,
            food: selectedFoods[i].food.id,
            day,
          }),
        );
      }
    }
    props.navigation.goBack();
  };

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
            height={selectedFoods.length > 0 ? 348 : "auto"}
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
        {selectedFoods.length > 0 && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            layout={LinearTransition.springify()
              .mass(0.5)
              .damping(15)
              .stiffness(100)}
            style={{ height: Dimensions.get("window").height / 2 }}
          >
            <Box
              marginTop="m"
              borderTopColor="borderColor"
              borderTopWidth={1}
              backgroundColor="mainBackground"
              flex={1}
            >
              <Box flexDirection="row" paddingTop="m" paddingHorizontal="l">
                <Box width={80}>
                  <Text color="secondaryText">Amount</Text>
                </Box>
                <Box flex={1} justifyContent="flex-start" paddingLeft="l">
                  <Text color="secondaryText">Name</Text>
                </Box>
                <Text color="secondaryText">Protein</Text>
              </Box>
              <Box maxHeight={180} height="auto" paddingTop="s">
                <ScrollView style={styles.selectedItemsScroll}>
                  {selectedFoods.map((food, index) => (
                    <Box
                      paddingHorizontal="l"
                      marginVertical="s"
                      key={`food-${food.food.id}`}
                      flexDirection="row"
                    >
                      <Box width={80}>
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="center"
                          backgroundColor="primaryButton"
                          borderRadius="m"
                          gap="s"
                          paddingHorizontal="s"
                          paddingVertical="xxs"
                        >
                          <Button
                            padding="xs"
                            icon={
                              <Icon icon={Minus} size={16} strokeWidth={2.5} />
                            }
                            onPress={() => {
                              if (selectedFoods[index].amount === 1) {
                                setSelectedFoods(
                                  selectedFoods.filter((_, i) => i !== index),
                                );
                              } else {
                                setSelectedFoods(
                                  selectedFoods.map((food, i) =>
                                    i === index
                                      ? { ...food, amount: food.amount - 1 }
                                      : food,
                                  ),
                                );
                              }
                            }}
                          />
                          <Text>{selectedFoods[index].amount}</Text>
                          <Button
                            padding="xs"
                            icon={
                              <Icon icon={Plus} size={16} strokeWidth={2.5} />
                            }
                            onPress={() => {
                              setSelectedFoods(
                                selectedFoods.map((food, i) =>
                                  i === index
                                    ? {
                                        ...food,
                                        amount: Math.min(food.amount + 1, 9),
                                      }
                                    : food,
                                ),
                              );
                            }}
                          />
                        </Box>
                      </Box>
                      <Box flex={1} justifyContent="flex-start" paddingLeft="l">
                        <Text>{food.food.name}</Text>
                      </Box>
                      <Text>{food.food.protein * food.amount}g</Text>
                    </Box>
                  ))}
                </ScrollView>
              </Box>
              <Animated.View layout={LinearTransition}>
                <Button
                  marginBottom="xxl"
                  marginHorizontal="l"
                  variant="primary"
                  onPress={handleSave}
                  labelPlacement="left"
                  label={
                    props.route.params?.entry
                      ? "Save"
                      : `Add ${selectedFoods.reduce(
                          (acc, food, index) =>
                            acc + food.food.protein * food.amount,
                          0,
                        )} g`
                  }
                  marginTop="l"
                />
              </Animated.View>
            </Box>
          </Animated.View>
        )}
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
