import { Fragment, useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { Plus, Minus } from "geist-native-icons";
import Animated, {
  LinearTransition,
  FadeIn,
  FadeOut,
  FadeOutDown,
} from "react-native-reanimated";

import { Box, Button, Icon, Text } from "@components";
import { useMyFoods } from "./context";
import { useAppDispatch } from "@store/hooks";
import { HomeScreenProps } from "@types";
import { updateEntry, addEntry } from "@store/slices/proteinSlice";

const styles = StyleSheet.create({
  selectedItemsScroll: {
    height: "auto",
  },
});

const SelectedFoods = (props: HomeScreenProps<"MyFoods">) => {
  const dispatch = useAppDispatch();
  const { selectedFoods, setSelectedFoods, day } = useMyFoods();

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
            food: selectedFoods[i].food,
            day,
          }),
        );
      }
    }
    props.navigation.goBack();
  };

  return (
    <Fragment>
      {selectedFoods.length > 0 && (
        <Animated.View
          entering={FadeIn}
          layout={LinearTransition.springify()
            .mass(0.5)
            .damping(15)
            .stiffness(100)}
          style={{ height: Dimensions.get("window").height }}
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
    </Fragment>
  );
};

export default SelectedFoods;
