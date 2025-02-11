import { useState, memo, useRef, useEffect } from "react";
import { Delete, Edit3 } from "geist-native-icons";
import {
  StyleSheet,
  TouchableHighlight,
  View,
  TextInput as RNTextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
  FadeOut,
} from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";
import LottieView from "lottie-react-native";

import fontStyles from "@styles/fonts";
import { dayFormat } from "@constants/formats";
import { Box, Text, Button, Icon, TextInput } from "@components";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectAccent, selectFont, selectUIDay } from "@store/slices/uiSlice";
import { addEntry, updateEntry } from "@store/slices/proteinSlice";
import type { RootScreenProps } from "@types";
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

  return (
    <TouchableHighlight
      onPress={() => onPress(value)}
      activeOpacity={0.97}
      style={styles.keyTouch}
      disabled={disabled}
      underlayColor={theme.colors.primaryText}
    >
      <Box
        backgroundColor="mainBackground"
        flex={1}
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        paddingTop="s"
      >
        <Text textAlign="center" fontSize={32} lineHeight={32}>
          {value === "del" ? (
            <Icon icon={Delete} size={24} color="primaryText" strokeWidth={2} />
          ) : (
            value
          )}
        </Text>
      </Box>
    </TouchableHighlight>
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
      <Box width="100%" gap="s" padding="l" justifyContent="center" flex={2}>
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          ["", 0, "del"],
        ].map((row, i) => (
          <Box
            key={i}
            flexDirection="row"
            gap="s"
            alignItems="center"
            justifyContent="center"
          >
            {row.map((key) => (
              <KeypadButton
                disabled={key === "" || (disabled && key !== "del")}
                key={key}
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
    <Box
      flexDirection="row"
      alignItems="baseline"
      justifyContent="center"
      style={styles.entryContainer}
    >
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
        <Text variant="bold" marginLeft="xs" fontSize={24} lineHeight={24}>
          g
        </Text>
      </Animated.View>
    </Box>
  );
};

const Entry = (props: RootScreenProps<"Entry">) => {
  const uiDay = useAppSelector(selectUIDay);
  const [value, setValue] = useState(props.route.params?.entry?.grams || 0);
  const font = useAppSelector(selectFont);
  const accent = useAppSelector(selectAccent);
  const [showSuccess, setShowSuccess] = useState(false);
  const animation = useRef<LottieView>(null);
  const [name, setName] = useState<string>(
    props.route.params?.entry?.name || "",
  );
  const [nameFocused, setNameFocused] = useState(false);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const nameInputRef = useRef<RNTextInput>(null);

  const handleKeyPress = (key: number | string) => {
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
          addEntry({ name: name?.trim(), grams: Number(value), day: uiDay }),
        );
      }
      props.navigation.goBack();
    }, 1700);
  };

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <StatusBar style={"light"} backgroundColor={"transparent"} translucent />
      <Box
        paddingTop="m"
        borderRadius="m"
        width="100%"
        backgroundColor="secondaryBackground"
        borderBottomColor="borderColor"
        borderBottomWidth={1}
      >
        <Box gap="xs" width="100%" alignItems="flex-start" marginBottom="m">
          <Text variant="header" color="primaryText" marginLeft="l">
            Add Protein&nbsp;&nbsp;
          </Text>
          <Text color="secondaryText" marginLeft="l">
            {dayjs(uiDay).format("dddd, MMM DD, YYYY")}
          </Text>
        </Box>
        <Box gap="s" width="100%" marginTop="m">
          {/* {showSuccess ? ( */}
          <Box>
            <View style={styles.successLottie}>
              <LottieView
                autoPlay={false}
                ref={animation}
                loop={false}
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
          gap="s"
          marginTop="ns"
          marginBottom="m"
          width="100%"
          justifyContent="center"
        >
          <TextInput
            borderLess
            ref={nameInputRef}
            placeholderTextColor={theme.colors.placeholderText}
            placeholder="Bagel & Cream Cheese "
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
                color={name ? "primaryText" : "placeholderText"}
              />
            </Button>
          )}
        </Box>
      </Box>
      <KeyPad
        handleKeyPress={handleKeyPress}
        disabled={value.toString().length >= 3}
      />
      <Button
        margin="l"
        variant="borderedPrimary"
        textColor="selected"
        marginBottom="xxxl"
        onPress={handleSubmit}
      >
        <Text color="primaryText" accent>
          {`${props.route.params?.entry ? "Update" : "Save"}`}
        </Text>
      </Button>
    </Box>
  );
};

export default Entry;

const styles = StyleSheet.create({
  entryContainer: {
    transform: [{ translateY: 8 }],
  },
  entry: {
    fontSize: 84,
    lineHeight: 84,
  },
  keyTouch: {
    flex: 1,
    width: 64,
    height: 64,
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
