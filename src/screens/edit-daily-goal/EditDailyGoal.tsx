import { useEffect, useState, useRef } from "react";
import { TouchableOpacity, Text as RNText } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Box, Button, Text } from "@components";
import { useTheme } from "@shopify/restyle";
import {
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
} from "geist-native-icons";

import fontStyles from "@styles/fonts";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectFont } from "@store/slices/uiSlice";
import { Icon, BackDrop } from "@components";
import {
  selectDailyProteinTarget,
  setDailyTarget,
  resetDailyTarget2Default,
} from "@store/slices/proteinSlice";
import { RootScreenProps } from "@types";
import SlotNumbers from "react-native-slot-numbers";

const Value = () => {
  const theme = useTheme();
  const dailyProteinTarget = useAppSelector(selectDailyProteinTarget);
  const selectedFont = useAppSelector(selectFont);
  const dispatch = useAppDispatch();
  const [displayVal, setDisplayVal] = useState(dailyProteinTarget);
  const bufferAddTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (displayVal !== dailyProteinTarget) {
      if (bufferAddTimer.current) {
        clearTimeout(bufferAddTimer.current);
      }
      bufferAddTimer.current = setTimeout(() => {
        dispatch(setDailyTarget(displayVal));
      }, 1000);
    }
  }, [displayVal]);

  useEffect(() => {
    setDisplayVal(dailyProteinTarget);
  }, [dailyProteinTarget]);

  return (
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
  );
};

const Appearance = (props: RootScreenProps<"EditDailyGoal">) => {
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
        <Box alignItems="center" gap="m" marginTop="l">
          <Text variant="header" color="secondaryText">
            Edit Daily Goal
          </Text>
          <Value />
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

export default Appearance;
