import { useState, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Plus, Minus } from "geist-native-icons";
import { useTheme } from "@shopify/restyle";
import Animated, { LinearTransition } from "react-native-reanimated";

import { Food, selectFoods } from "@store/slices/foodsSlice";
import { Box, Button, Icon, Text } from "@components";
import { BackDrop } from "@components";
import { HomeScreenProps } from "@types";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addEntry, updateEntry } from "@store/slices/proteinSlice";
import { selectUIDay } from "@store/slices/uiSlice";
import FoodList from "./FoodList";

const Appearance = (props: HomeScreenProps<"MyFoods">) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const foods = useAppSelector(selectFoods);
  const uiDay = useAppSelector(selectUIDay);

  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [selectedAmounts, setSelectedAmounts] = useState<number[]>([1]);

  useEffect(() => {
    if (props.route.params?.entry) {
      setSelectedFoods(
        foods.filter((food) => food.id === props.route.params?.entry?.food),
      );
      setSelectedAmounts([
        props.route.params?.entry?.grams! /
          foods.find((food) => food.id === props.route.params?.entry?.food)!
            .protein,
      ]);
    }
  }, [props.route.params?.entry]);

  const handleSave = () => {
    if (props.route.params?.entry) {
      dispatch(
        updateEntry({
          ...props.route.params.entry,
          food: selectedFoods[0].id,
          grams: selectedFoods[0].protein * selectedAmounts[0],
        }),
      );
    } else {
      for (let i = 0; i < selectedFoods.length; i++) {
        dispatch(
          addEntry({
            grams: selectedFoods[i].protein * selectedAmounts[i],
            food: selectedFoods[i].id,
            day: uiDay,
          }),
        );
      }
    }
    props.navigation.goBack();
  };

  return (
    <BottomSheet
      onClose={() => props.navigation.goBack()}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.colors.mainBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.tertiaryText,
      }}
      backdropComponent={() => <BackDrop blurIntensity={10} />}
    >
      <BottomSheetView>
        <Box gap="m" marginBottom="l" paddingHorizontal="l">
          <Box
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
          >
            <Text variant="header">
              {props.route.params?.entry ? "Update" : "My Foods"}
            </Text>
            <Button
              borderRadius="m"
              backgroundColor="transparent"
              borderColor="borderColor"
              borderWidth={1}
              padding="xs"
              paddingHorizontal="sm"
              fontSize={14}
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
          </Box>
        </Box>
        <Box minHeight={200} marginBottom="xl">
          {!props.route.params?.entry && (
            <FoodList
              selectedFoods={selectedFoods}
              onPress={(food) => {
                setSelectedFoods([...selectedFoods, food]);
                setSelectedAmounts([...selectedAmounts, 1]);
              }}
            />
          )}
          {selectedFoods.length > 0 && (
            <Box marginTop="m">
              <Box flexDirection="row" justifyContent="space-between">
                <Box gap="m">
                  <Box
                    borderBottomColor="seperator"
                    borderBottomWidth={1.5}
                    paddingBottom="s"
                  >
                    <Text variant="body" paddingLeft="l" color="tertiaryText">
                      Amount
                    </Text>
                  </Box>
                  {selectedFoods.map((food, index) => (
                    <Box
                      marginLeft="l"
                      gap="s"
                      backgroundColor="primaryButton"
                      borderRadius="m"
                      flexDirection="row"
                      alignItems="center"
                      paddingVertical="xs"
                      paddingHorizontal="s"
                      key={`amount-button-${index}`}
                    >
                      <Button
                        padding="xs"
                        icon={<Icon icon={Minus} size={16} strokeWidth={2.5} />}
                        onPress={() => {
                          if (selectedAmounts[index] > 1) {
                            setSelectedAmounts((prev) => {
                              const newAmounts = [...prev];
                              newAmounts[index] = prev[index] - 1;
                              return newAmounts;
                            });
                          }
                          // If editin the entry, don't allow to go to 0.
                          // User should just remove the entry instead.
                          else if (!props.route.params?.entry) {
                            setSelectedFoods((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                            setSelectedAmounts((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }
                        }}
                      />
                      <Text variant="body">
                        {selectedAmounts?.[index]?.toString() ?? "1"}
                      </Text>
                      <Button
                        padding="xs"
                        icon={<Icon icon={Plus} size={16} strokeWidth={2.5} />}
                        onPress={() => {
                          setSelectedAmounts((prev) => {
                            const newAmounts = [...prev];
                            newAmounts[index] = prev[index] + 1;
                            return newAmounts;
                          });
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                <Box gap="m" flex={1}>
                  <Box
                    borderBottomColor="seperator"
                    borderBottomWidth={1.5}
                    paddingBottom="s"
                  >
                    <Text variant="body" paddingLeft="l" color="tertiaryText">
                      Name
                    </Text>
                  </Box>
                  {selectedFoods.map((food) => (
                    <Text
                      variant="body"
                      paddingLeft="l"
                      paddingVertical="xs"
                      key={`name-${food.id}`}
                    >
                      {food.name}
                    </Text>
                  ))}
                </Box>
                <Box gap="m">
                  <Box
                    borderBottomColor="seperator"
                    borderBottomWidth={1.5}
                    paddingBottom="s"
                  >
                    <Text variant="body" paddingRight="l" color="tertiaryText">
                      Total
                    </Text>
                  </Box>
                  {selectedFoods.map((food, index) => (
                    <Text
                      key={`amount-${index}`}
                      variant="body"
                      paddingRight="l"
                      textAlign="right"
                      paddingVertical="xs"
                    >
                      {food.protein * selectedAmounts[index]}g
                    </Text>
                  ))}
                </Box>
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
                            acc + food.protein * selectedAmounts[index],
                          0,
                        )} g`
                  }
                  marginTop="xxl"
                  marginBottom="l"
                />
              </Animated.View>
            </Box>
          )}
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default Appearance;
