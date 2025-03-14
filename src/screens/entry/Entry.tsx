import { useState, memo, useRef, useEffect } from "react";
import { ChevronDown, Delete, Edit3 } from "geist-native-icons";
import {
  StyleSheet,
  TouchableHighlight,
  View,
  TextInput as RNTextInput,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";
import LottieView from "lottie-react-native";
import DatePicker from "react-native-date-picker";
import * as Haptics from "expo-haptics";

import fontStyles from "@styles/fonts";
import { Box, Text, Button, Icon, TextInput } from "@components";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectAccent, selectFont } from "@store/slices/uiSlice";
import { addEntry, updateEntry } from "@store/slices/proteinSlice";
import type { HomeScreenProps } from "@types";
import { dayFormat } from "@constants/formats";
import success from "@lotties/success.json";

const KeypadButton = ({
  value,
  onPress,
  disabled,
}: {
  value: string | number;
  onPress: (value: string | number) => void;
  disabled: boolean;
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        { flex: 1, width: "100%" },
        animatedStyle,
        styles.keyTouchContainer,
      ]}
    >
      <TouchableHighlight
        style={styles.keyTouch}
        onPress={() => onPress(value)}
        onPressIn={() => {
          scale.value = withSpring(0.85, { mass: 0.5, damping: 8 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { mass: 0.5, damping: 8 });
        }}
        activeOpacity={1}
        disabled={disabled}
        underlayColor={theme.colors.primaryButton}
      >
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
          paddingTop="s"
        >
          <Text textAlign="center" fontSize={32} lineHeight={32}>
            {value === "del" ? (
              <Icon
                icon={Delete}
                size={24}
                color="primaryText"
                strokeWidth={2}
              />
            ) : (
              value
            )}
          </Text>
        </Box>
      </TouchableHighlight>
    </Animated.View>
  );
};

const KeyPad = memo(
  ({
    handleKeyPress,
    disabled,
  }: {
    handleKeyPress: (key: number | string) => void;
    disabled: boolean;
  }) => {
    return (
      <Box width="100%" gap="s" padding="l" justifyContent="center">
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          ["", 0, "del"],
        ].map((row, i) => (
          <Box
            key={`keypad-row-${i}`}
            flexDirection="row"
            gap="s"
            alignItems="center"
            justifyContent="center"
          >
            {row.map((key) => (
              <KeypadButton
                disabled={key === "" || (disabled && key !== "del")}
                key={`keypad-button-${key}`}
                value={key}
                onPress={() => handleKeyPress(key)}
              />
            ))}
          </Box>
        ))}
      </Box>
    );
  },
);

const Value = ({ value }: { value: number }) => {
  const theme = useTheme();
  const font = useAppSelector(selectFont);

  return (
    <Box flexDirection="row" alignItems="baseline" justifyContent="center">
      {value
        .toString()
        .split("")
        .map((char, i) => (
          <Animated.Text
            key={`num-${char}-${i}`}
            entering={FadeInUp.springify().damping(15).stiffness(150)}
            exiting={FadeOutDown.springify().damping(15).stiffness(150)}
            layout={LinearTransition}
            style={[
              fontStyles[font],
              styles.entry,
              { color: theme.colors.primaryText },
            ]}
          >
            {char}
          </Animated.Text>
        ))}
      <Animated.View layout={LinearTransition}>
        <Box paddingBottom="s">
          <Text variant="bold" marginLeft="xs" fontSize={32} lineHeight={44}>
            g
          </Text>
        </Box>
      </Animated.View>
    </Box>
  );
};

const Entry = (props: HomeScreenProps<"Entry">) => {
  const [value, setValue] = useState(props.route.params?.entry?.grams || 0);
  const font = useAppSelector(selectFont);
  const accent = useAppSelector(selectAccent);
  const [showSuccess, setShowSuccess] = useState(false);
  const [day, setDay] = useState(dayjs().format(dayFormat));
  const animation = useRef<LottieView>(null);
  const [name, setName] = useState<string>(
    props.route.params?.entry?.name || "",
  );
  const [nameFocused, setNameFocused] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const nameInputRef = useRef<RNTextInput>(null);

  const handleKeyPress = (key: number | string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (typeof key === "string") {
      setValue((prev) => Math.floor(prev / 10));
      return;
    }
    setValue((prev) => prev * 10 + key);
  };

  useEffect(() => {
    setTimeout(() => {
      animation.current?.reset();
    }, 0);
  }, []);

  const handleSubmit = () => {
    animation.current?.reset();
    animation.current?.play();
    setShowSuccess(true);

    setTimeout(() => {
      if (props.route.params?.entry) {
        dispatch(
          updateEntry({
            ...props.route.params.entry,
            grams: Number(value),
            name: name?.trim(),
          }),
        );
      } else {
        dispatch(
          addEntry({
            name: name?.trim(),
            grams: Number(value),
            day,
          }),
        );
      }
      props.navigation.goBack();
    }, 1700);
  };

  return (
    <Box flex={1} backgroundColor="mainBackground">
      {Platform.OS === "ios" && (
        <StatusBar
          style={"light"}
          backgroundColor={"transparent"}
          translucent
        />
      )}
      <Box
        paddingTop={Platform.OS === "android" ? "none" : "m"}
        borderRadius="m"
        width="100%"
        backgroundColor="secondaryBackground"
        borderBottomColor="borderColor"
        borderBottomWidth={1}
      >
        <Box
          width="100%"
          alignItems="flex-start"
          marginBottom="m"
          marginTop="s"
        >
          <Text variant="header" color="primaryText" marginLeft="l">
            Add Protein&nbsp;&nbsp;
          </Text>
          <Button
            label={
              dayjs(day).isSame(dayjs(), "day")
                ? "Today"
                : dayjs(day).format("ddd, MMM DD, YYYY")
            }
            textColor="secondaryText"
            marginLeft="m"
            marginTop="nxs"
            labelPlacement="left"
            alignItems="center"
            icon={
              <Box marginTop={"xs"}>
                <Icon
                  icon={ChevronDown}
                  size={16}
                  strokeWidth={2.5}
                  color="secondaryText"
                />
              </Box>
            }
            onPress={() => setOpenDatePicker(true)}
          />
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
        </Box>
        <Box gap="s" width="100%">
          {/* {showSuccess ? ( */}
          <Box>
            <View style={styles.successLottie}>
              <LottieView
                ref={animation}
                loop={false}
                autoPlay={false}
                style={{ width: 48, height: 48 }}
                source={success}
                colorFilters={[
                  {
                    keypath: "check",
                    color: theme.colors[accent] || theme.colors.primaryText,
                  },
                  {
                    keypath: "circle",
                    color: theme.colors[accent] || theme.colors.primaryText,
                  },
                ]}
              />
            </View>
            {showSuccess && (
              <Text
                style={[fontStyles[font], styles.entry]}
                color="transparent"
              >
                1
              </Text>
            )}
          </Box>
          {!showSuccess && (
            <Animated.View exiting={FadeOut}>
              <Value value={value} />
            </Animated.View>
          )}
        </Box>
        <Box
          flexDirection="row"
          alignItems="center"
          marginTop="ns"
          marginBottom="m"
          width="100%"
          justifyContent="center"
        >
          <TextInput
            borderLess
            ref={nameInputRef}
            placeholderTextColor={theme.colors.placeholderText}
            placeholder={nameFocused ? "" : "Bagel & Cream Cheese "}
            value={name}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            onChangeText={setName}
          />
          {!nameFocused && (
            <Button
              marginLeft="nl"
              onPress={() => nameInputRef.current?.focus()}
            >
              <Icon
                icon={Edit3}
                size={18}
                borderColor={name ? "primaryText" : "placeholderText"}
                color={name ? "primaryText" : "placeholderText"}
              />
            </Button>
          )}
        </Box>
      </Box>
      <Box flex={1} justifyContent="space-evenly">
        <KeyPad
          handleKeyPress={handleKeyPress}
          disabled={value.toString().length >= 3}
        />
        <Box marginBottom="l">
          <Button
            margin="l"
            marginBottom="xxxl"
            variant="primary"
            textColor="selected"
            onPress={handleSubmit}
          >
            <Text color="primaryText" accent>
              {`${props.route.params?.entry ? "Update" : "Save"}`}
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Entry;

const styles = StyleSheet.create({
  entry: {
    fontSize: 84,
    lineHeight: 84,
  },
  keyTouchContainer: {
    flex: 1,
    width: 64,
    height: 64,
  },
  keyTouch: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mask: {
    width: "100%",
    justifyContent: "center",
    alignItems: "baseline",
    flexDirection: "row",
  },
  successLottie: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
});
