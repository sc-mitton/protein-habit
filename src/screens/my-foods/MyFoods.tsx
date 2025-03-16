import { useState, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { View, Dimensions, ScrollView, StyleSheet } from "react-native";
import { Plus, Minus, ChevronDown } from "geist-native-icons";
import { useTheme } from "@shopify/restyle";
import Animated, { LinearTransition } from "react-native-reanimated";
import DatePicker from "react-native-date-picker";
import dayjs from "dayjs";

import { dayFormat } from "@constants/formats";
import { Food, selectFoods } from "@store/slices/foodsSlice";
import { Box, Button, Icon, Text } from "@components";
import { BackDrop } from "@components";
import { HomeScreenProps } from "@types";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addEntry, updateEntry } from "@store/slices/proteinSlice";
import FoodList from "./FoodList";
import { Theme } from "@theme";

const styles = StyleSheet.create({
  selectedItemsScroll: {
    height: "auto",
  },
});

const MyFoods = (props: HomeScreenProps<"MyFoods">) => {
  const dispatch = useAppDispatch();
  const foods = useAppSelector(selectFoods);

  const [day, setDay] = useState(dayjs().format(dayFormat));
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<
    {
      food: Food;
      amount: number;
    }[]
  >([]);

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
    <View style={{ maxHeight: Dimensions.get("window").height }}>
      <Box gap="m" paddingLeft="l" paddingRight="m">
        <Box
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <Box>
            <Text variant="header">
              {props.route.params?.entry
                ? "Update"
                : selectedFoods.length > 0
                  ? "Add Protein"
                  : "My Foods"}
            </Text>
            {selectedFoods.length > 0 && !props.route.params?.entry && (
              <Button
                label={
                  dayjs(day).isSame(dayjs(), "day")
                    ? "Today"
                    : dayjs(day).format("ddd, MMM DD, YYYY")
                }
                textColor="secondaryText"
                marginLeft="ns"
                labelPlacement="left"
                icon={
                  <Icon
                    icon={ChevronDown}
                    size={16}
                    strokeWidth={2.5}
                    color="secondaryText"
                  />
                }
                onPress={() => setOpenDatePicker(true)}
              />
            )}
          </Box>
          <DatePicker
            modal
            mode="date"
            maximumDate={dayjs().toDate()}
            open={openDatePicker}
            date={dayjs(day).toDate()}
            onConfirm={(date) => {
              setDay(dayjs(date).format(dayFormat));
              setOpenDatePicker(false);
            }}
            onCancel={() => setOpenDatePicker(false)}
          />
          {selectedFoods.length === 0 && (
            <Button
              borderRadius="m"
              backgroundColor="transparent"
              borderColor="borderColor"
              borderWidth={1}
              padding="s"
              paddingVertical="xxs"
              paddingHorizontal="s"
              fontSize={15}
              labelPlacement="left"
              onPress={() => {
                props.navigation.navigate("AddFood");
              }}
              label="New"
              textColor="primaryText"
              icon={
                <Icon
                  icon={Plus}
                  size={16}
                  strokeWidth={2}
                  color="primaryText"
                />
              }
            />
          )}
        </Box>
      </Box>
      <Box>
        {!props.route.params?.entry && (
          <View
            style={{
              height: selectedFoods.length > 0 ? 348 : "auto",
            }}
          >
            <FoodList
              selectedFoods={selectedFoods.map((food) => food.food.id)}
              onPress={(food) => {
                setSelectedFoods([...selectedFoods, { food, amount: 1 }]);
              }}
            />
          </View>
        )}
        {selectedFoods.length > 0 && (
          <Box
            marginTop="m"
            borderTopColor="borderColor"
            borderTopWidth={1}
            style={{ height: Dimensions.get("window").height / 2 }}
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
        )}
      </Box>
    </View>
  );
};

export default function (props: HomeScreenProps<"MyFoods">) {
  const theme = useTheme<Theme>();

  return (
    <BottomSheet
      enablePanDownToClose
      onClose={() => props.navigation.goBack()}
      topInset={theme.spacing.statusBar * 2.5}
      enableOverDrag={false}
      enableDynamicSizing={true}
      backgroundStyle={{
        backgroundColor: theme.colors.modalBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.tertiaryText,
      }}
      backdropComponent={() => <BackDrop blurIntensity={30} />}
    >
      <BottomSheetView>
        <MyFoods {...props} />
      </BottomSheetView>
    </BottomSheet>
  );
}
