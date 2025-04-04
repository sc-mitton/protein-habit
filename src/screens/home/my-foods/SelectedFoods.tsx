import { Fragment } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Animated, { LinearTransition, FadeIn } from "react-native-reanimated";

import { Box, Button, IncrementDecrement, Text } from "@components";
import { useMyFoods } from "./context";
import { useAppDispatch } from "@store/hooks";
import { HomeScreenProps } from "@types";
import { updateEntry, addEntry } from "@store/slices/proteinSlice";

const styles = StyleSheet.create({
  selectedItemsScroll: {
    height: "auto",
  },
});

const SelectedFoods = (props: HomeScreenProps<"MyFoodsModal">) => {
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
            food: selectedFoods[i].food,
            amount: selectedFoods[i].amount,
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
          style={{
            flex: 1,
            flexGrow: 1,
          }}
        >
          <Box
            marginTop="m"
            borderTopColor="borderColor"
            borderTopWidth={1}
            backgroundColor={"modalBackground"}
            flex={1}
            flexGrow={1}
            paddingBottom="xl"
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
            <Box paddingTop="s" flex={1} flexGrow={1}>
              <ScrollView style={styles.selectedItemsScroll}>
                {selectedFoods.map((food, index) => (
                  <Box
                    paddingHorizontal="l"
                    marginVertical="s"
                    key={`food-${food.food.id}`}
                    flexDirection="row"
                  >
                    <IncrementDecrement
                      value={food.amount}
                      onIncrement={() => {
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
                      onDecrement={() => {
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
