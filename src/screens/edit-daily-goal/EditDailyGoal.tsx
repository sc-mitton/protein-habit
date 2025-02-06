import { useEffect, useState, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import SlotNumbers from "react-native-slot-numbers";
import { Text as RNText, Platform, View } from "react-native";
import {
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
} from "geist-native-icons";
import { useTheme } from "@shopify/restyle";

import fontStyles from "@styles/fonts";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectFont } from "@store/slices/uiSlice";
import { Box, Button, Text, Icon } from "@components";
import { selectDailyProteinTarget } from "@store/slices/proteinSelectors";
import {
  setDailyTarget,
  resetDailyTarget2Default,
} from "@store/slices/proteinSlice";
import { RootScreenProps } from "@types";

import { BackDrop } from "@components";
import { StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const Value = ({ onSave }: { onSave: () => void }) => {
  const theme = useTheme();
  const dailyProteinTarget = useAppSelector(selectDailyProteinTarget);
  const selectedFont = useAppSelector(selectFont);
  const dispatch = useAppDispatch();
  const [displayVal, setDisplayVal] = useState(dailyProteinTarget);

  useEffect(() => {
    setDisplayVal(dailyProteinTarget);
  }, [dailyProteinTarget]);

  return (
    <View>
      <Box
        flexDirection="row"
        alignItems="center"
        gap="m"
        marginBottom="s"
        marginTop="l"
      >
        <Button
          icon={<Icon strokeWidth={2} icon={ChevronsDown} size={18} />}
          backgroundColor="transparent"
          borderColor="seperator"
          borderWidth={1}
          borderRadius="full"
          padding="xs"
          onPress={() => {
            setDisplayVal((prev) => prev - 10);
          }}
        />
        <Button
          icon={<Icon strokeWidth={2} icon={ChevronDown} size={24} />}
          backgroundColor="transparent"
          borderColor="seperator"
          borderWidth={1}
          borderRadius="full"
          padding="s"
          onPress={() => setDisplayVal((prev) => prev - 1)}
        />
        <Box flexDirection="row" alignItems="baseline">
          <SlotNumbers
            value={displayVal}
            animateIntermediateValues
            animationDuration={300}
            easing={"in-out"}
            fontStyle={[
              fontStyles[selectedFont],
              { fontSize: 64 },
              { color: theme.colors.primaryText },
            ]}
          />
          <Box marginLeft="xs">
            <RNText
              style={[
                { fontSize: 22, color: theme.colors.primaryText },
                fontStyles[selectedFont],
              ]}
            >
              g
            </RNText>
          </Box>
        </Box>
        <Button
          icon={<Icon strokeWidth={2} icon={ChevronUp} size={24} />}
          backgroundColor="transparent"
          borderColor="seperator"
          borderWidth={1}
          borderRadius="full"
          padding="s"
          onPress={() => setDisplayVal((prev) => prev + 1)}
        />
        <Button
          icon={<Icon strokeWidth={2} icon={ChevronsUp} size={18} />}
          backgroundColor="transparent"
          borderColor="seperator"
          borderWidth={1}
          borderRadius="full"
          padding="xs"
          onPress={() => setDisplayVal((prev) => prev + 10)}
        />
      </Box>
      {displayVal !== dailyProteinTarget && (
        <Button
          marginTop="l"
          label="Save"
          variant="primary"
          onPress={() => {
            dispatch(setDailyTarget(displayVal));
            onSave();
          }}
        />
      )}
    </View>
  );
};

const EditDailyGoal = (props: RootScreenProps<"EditDailyGoal">) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

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
      backdropComponent={() => <BackDrop />}
    >
      <BottomSheetView>
        <Box
          alignItems="center"
          gap="m"
          marginTop="l"
          backgroundColor="mainBackground"
        >
          <Text variant="header" color="secondaryText">
            Edit Daily Goal
          </Text>
          <Value onSave={() => props.navigation.goBack()} />
          <Box padding="l">
            <Text variant="body" color="tertiaryText" fontSize={14}>
              Based on current research, 0.7 grams of protein per pound of body
              weight is recommended for most people trying to build muscle.
            </Text>
            <Button
              onPress={() => {
                dispatch(resetDailyTarget2Default());
              }}
              variant="primary"
              backgroundColor="transparent"
              label="Reset to Default"
              textColor="selected"
            />
          </Box>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default EditDailyGoal;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: -Dimensions.get("window").width,
    left: 0,
    right: 0,
    bottom: -Dimensions.get("window").width,
  },
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    opacity: 1,
  },
});
