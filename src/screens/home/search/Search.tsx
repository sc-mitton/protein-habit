import { useState, useEffect, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Keyboard,
  View,
  Appearance,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  FadeOut,
  FadeIn,
  FadeInDown,
  LinearTransition,
  FadeOutLeft,
} from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SymbolView } from "expo-symbols";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";

import {
  BackDrop,
  Box,
  PulseText,
  Button,
  Text,
  SwipeOptions,
  IncrementDecrement,
} from "@components";
import { RootScreenProps } from "@types";
import OutsidePressHandler from "react-native-outside-press";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";
import { addEntry } from "@store/slices/proteinSlice";
import { useSearchProteinMutation } from "@store/slices/proteinSearchSlice";
import type { ProteinSearchResults } from "@store/slices/proteinSearchSlice";
import { dayFormat } from "@constants/formats";
import Placeholder from "./Placeholder";
import EdgeAnimation from "./EdgeAnimation";

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    marginHorizontal: 38,
    marginTop: Platform.OS === "ios" ? 18 : 16,
    fontFamily: "InterRegular",
  },
  placeholderInnput: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
  },
  boxContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  box: {
    borderRadius: Appearance.getColorScheme() === "dark" ? 16 : 15,
    marginVertical: Appearance.getColorScheme() === "dark" ? 2 : 2,
    marginHorizontal: Appearance.getColorScheme() === "dark" ? 1.5 : 2,
  },
  placeholderContainer: {
    position: "absolute",
    top: 28,
    left: 16,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  placeholder: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingContainer: {
    flex: 12,
    flexGrow: 12,
  },
});

const Search = (props: RootScreenProps<"SearchModal">) => {
  const theme = useTheme();
  const accent = useAppSelector(selectAccent);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");
  const { height, progress } = useReanimatedKeyboardAnimation();
  const measuredKeyboardHeight = useSharedValue(60);
  const [getProteinSearch, { data, isLoading, isError, error }] =
    useSearchProteinMutation();
  const [searchListResults, setSearchListResults] = useState<
    ProteinSearchResults["results"]
  >([]);
  const searchField = useRef<TextInput>(null);

  const handleGoPress = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    if (value.length === 0) {
      props.navigation.goBack();
    } else {
      getProteinSearch(value);
    }
  };

  const handleSave = () => {
    dispatch(
      addEntry({
        name: value,
        grams: searchListResults.reduce(
          (acc, item) => acc + item.protein_amount,
          0,
        ),
        day: dayjs().format(dayFormat),
      }),
    );
    props.navigation.goBack();
  };

  const handleDelete = (index: number) => {
    if (searchListResults.length === 1) {
      setTimeout(() => {
        props.navigation.goBack();
      }, 1000);
    }
    setSearchListResults(searchListResults.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isError) {
      Alert.alert("😵‍💫\nNo results found", `Maybe try rephrasing your search?`, [
        {
          text: "OK",
          onPress: () => {
            setValue("");
            searchField.current?.focus();
          },
        },
      ]);
    }
  }, [isError]);

  const animation = useAnimatedStyle(() => {
    return {
      height:
        progress.value > 0
          ? 60
          : withDelay(200, withTiming(1.25 * measuredKeyboardHeight.value)),
      opacity:
        progress.value > 0
          ? 1
          : withDelay(400, withTiming(1, { duration: 200 })),
      transform: [
        {
          translateY:
            progress.value > 0
              ? height.value - 16
              : withDelay(
                  500,
                  withTiming(-0.75 * measuredKeyboardHeight.value),
                ),
        },
      ],
    };
  });

  useEffect(() => {
    if (data) {
      setSearchListResults(
        data.results.map((item) => ({
          ...item,
          protein_amount: Math.ceil(item.protein_amount),
        })),
      );
    }
  }, [data]);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", (e) => {
      measuredKeyboardHeight.value = e.endCoordinates.height;
    });
  }, []);

  return (
    <OutsidePressHandler onOutsidePress={() => props.navigation.goBack()}>
      <Animated.View style={[animation, styles.boxContainer]}>
        <EdgeAnimation />
        <Box backgroundColor="modalBackground" style={styles.box} flex={1}>
          <View style={styles.placeholderContainer}>
            <Animated.View style={styles.placeholder} exiting={FadeOut}>
              <SymbolView
                name="sparkle"
                tintColor={
                  value.length > 0
                    ? accent
                      ? theme.colors[accent]
                      : theme.colors.secondaryText
                    : theme.colors.placeholderText
                }
                size={16}
                fallback={
                  <Ionicons
                    name="sparkles-sharp"
                    size={16}
                    color={
                      value.length > 0
                        ? accent
                          ? theme.colors[accent]
                          : theme.colors.secondaryText
                        : theme.colors.placeholderText
                    }
                  />
                }
              />
              {value.length <= 0 && <Placeholder />}
            </Animated.View>
          </View>
          <TextInput
            placeholder=""
            returnKeyType="go"
            value={value}
            onChangeText={setValue}
            autoCorrect={true}
            onSubmitEditing={handleGoPress}
            selectionColor={accent && theme.colors[accent]}
            autoFocus
            ref={searchField}
            style={[
              styles.input,
              { color: theme.colors.primaryText },
              value.length <= 0 && styles.placeholderInnput,
            ]}
          />
          {isLoading && (
            <Animated.View
              entering={FadeIn.delay(300)}
              style={styles.loadingContainer}
            >
              <Box
                gap="l"
                justifyContent="center"
                paddingVertical="l"
                paddingHorizontal="ml"
              >
                <PulseText width={"100%"} numberOfLines={2} />
                <PulseText width={"100%"} numberOfLines={2} />
                <PulseText width={"80%"} numberOfLines={2} />
              </Box>
            </Animated.View>
          )}
          {searchListResults && (
            <Box flex={1} flexGrow={1}>
              <Box
                key={`search-results-${searchListResults.length}`}
                justifyContent="flex-start"
                paddingVertical="l"
                paddingHorizontal="ml"
                flex={1}
                flexGrow={1}
              >
                <ScrollView>
                  {searchListResults.map((item, index) => (
                    <Animated.View
                      entering={FadeInDown.delay(index * 100)}
                      exiting={FadeOutLeft}
                      layout={LinearTransition}
                      key={item.food_item}
                    >
                      <SwipeOptions
                        onDelete={() => handleDelete(index)}
                        noEdit={true}
                      >
                        <Box
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                          borderTopWidth={1.5}
                          borderTopColor={"borderColor"}
                          paddingVertical="m"
                          gap="s"
                        >
                          <SymbolView
                            name="checkmark.circle.fill"
                            size={18}
                            tintColor={theme.colors.primaryText}
                            fallback={
                              <AntDesign
                                name="checkcircle"
                                size={18}
                                color={theme.colors.primaryText}
                              />
                            }
                          />
                          <Box flex={1} justifyContent="flex-start">
                            <Text>{item.food_item}</Text>
                          </Box>
                          <IncrementDecrement
                            value={Math.ceil(item.protein_amount)}
                            onIncrement={() => {
                              setSearchListResults((prev) => {
                                return prev.map((item, i) => {
                                  if (i === index) {
                                    return {
                                      ...item,
                                      protein_amount: item.protein_amount + 1,
                                    };
                                  }
                                  return item;
                                });
                              });
                            }}
                            onDecrement={() => {
                              setSearchListResults((prev) => {
                                return prev.map((item, i) => {
                                  if (i === index) {
                                    return {
                                      ...item,
                                      protein_amount: Math.max(
                                        item.protein_amount - 1,
                                        0,
                                      ),
                                    };
                                  }
                                  return item;
                                });
                              });
                            }}
                            suffix={"g"}
                          />
                        </Box>
                      </SwipeOptions>
                    </Animated.View>
                  ))}
                </ScrollView>
              </Box>
              <Animated.View entering={FadeIn}>
                <Button
                  onPress={handleSave}
                  label="Add"
                  variant="primary"
                  paddingVertical="sm"
                  marginHorizontal="ml"
                  marginBottom="ml"
                />
              </Animated.View>
            </Box>
          )}
        </Box>
      </Animated.View>
    </OutsidePressHandler>
  );
};

export default function (props: RootScreenProps<"SearchModal">) {
  return (
    <BottomSheet
      onClose={() => props.navigation.goBack()}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "transparent" }}
      handleComponent={null}
      backdropComponent={() => <BackDrop blurIntensity={30} />}
      detached={true}
      style={{
        marginHorizontal: 12,
      }}
    >
      <BottomSheetView>
        <Search {...props} />
      </BottomSheetView>
    </BottomSheet>
  );
}
