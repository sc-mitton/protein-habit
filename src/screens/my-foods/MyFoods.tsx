import { useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Plus, Minus } from "geist-native-icons";
import { StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@shopify/restyle";
import Animated, { LinearTransition } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Food, selectFoods } from "@store/slices/foodsSlice";
import { Box, Button, Icon, Text } from "@components";
import { BackDrop } from "@components";
import { RootScreenProps } from "@types";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { addEntry } from "@store/slices/proteinSlice";
import FoodItem from "./FoodItem";

const Appearance = (props: RootScreenProps<"MyFoods">) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const foods = useAppSelector(selectFoods);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [selectedAmounts, setSelectedAmounts] = useState<number[]>([1]);

  const handleSave = () => {
    for (let i = 0; i < selectedFoods.length; i++) {
      dispatch(
        addEntry({
          grams: selectedFoods[i].protein * selectedAmounts[i],
          food: selectedFoods[i].id,
        }),
      );
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
            <Text variant="header">My Foods</Text>
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
          {foods.length > 0 ? (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {foods
                .filter((f) => !selectedFoods.some((sf) => sf.id === f.id))
                .map((food) => (
                  <Animated.View layout={LinearTransition} key={food.id}>
                    <FoodItem
                      key={food.id}
                      food={food}
                      onPress={() => {
                        setSelectedFoods([...selectedFoods, food]);
                        setSelectedAmounts([...selectedAmounts, 1]);
                      }}
                    />
                  </Animated.View>
                ))}
            </ScrollView>
          ) : (
            <Box
              flex={1}
              justifyContent="flex-start"
              alignItems="center"
              gap="l"
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
              <Box width={"50%"}>
                <Text variant="body" color="tertiaryText" textAlign="center">
                  Add your most common foods to quickly add their protein in the
                  future
                </Text>
              </Box>
            </Box>
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
                        icon={<Icon icon={Minus} size={16} strokeWidth={2} />}
                        onPress={() => {
                          if (selectedAmounts[index] > 1) {
                            setSelectedAmounts((prev) => {
                              const newAmounts = [...prev];
                              newAmounts[index] = prev[index] - 1;
                              return newAmounts;
                            });
                          } else {
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
                        icon={<Icon icon={Plus} size={16} strokeWidth={2} />}
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
                  icon={<Icon icon={Plus} size={16} strokeWidth={2} />}
                  labelPlacement="left"
                  label={`${selectedFoods.reduce(
                    (acc, food, index) =>
                      acc + food.protein * selectedAmounts[index],
                    0,
                  )} grams`}
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

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 12,
    paddingVertical: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
});
