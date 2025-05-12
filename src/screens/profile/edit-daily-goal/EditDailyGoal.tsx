import { useEffect, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import SlotNumbers from "react-native-slot-numbers";
import { Text as RNText, View } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "geist-native-icons";
import { useTheme } from "@shopify/restyle";

import fontStyles from "@styles/fonts";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectFont } from "@store/slices/uiSlice";
import { Box, Button, Text, Icon } from "@components";
import { selectDailyProteinTarget } from "@store/slices/proteinSelectors";
import {
  setDailyTarget,
  getRecommendedTarget,
} from "@store/slices/proteinSlice";
import { ProfileScreenProps } from "@types";

import { BackDrop } from "@components";
import { selectUserInfo } from "@store/slices/userSlice";

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
          icon={<Icon strokeWidth={2} icon={ChevronsLeft} size={18} />}
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
          icon={<Icon strokeWidth={2} icon={ChevronLeft} size={24} />}
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
          icon={<Icon strokeWidth={2} icon={ChevronRight} size={24} />}
          backgroundColor="transparent"
          borderColor="seperator"
          borderWidth={1}
          borderRadius="full"
          padding="s"
          onPress={() => setDisplayVal((prev) => prev + 1)}
        />
        <Button
          icon={<Icon strokeWidth={2} icon={ChevronsRight} size={18} />}
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

const EditDailyGoal = (props: ProfileScreenProps<"EditDailyGoalModal">) => {
  const theme = useTheme();
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  return (
    <BottomSheet
      onClose={() => props.navigation.goBack()}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.colors.modalBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.tertiaryText,
      }}
      backdropComponent={() => <BackDrop blurIntensity={40} />}
    >
      <BottomSheetView>
        <Box
          alignItems="center"
          gap="m"
          marginTop="l"
          backgroundColor="modalBackground"
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
              accent={true}
              onPress={() => {
                dispatch(
                  setDailyTarget(
                    getRecommendedTarget(
                      userInfo.weight.value,
                      userInfo.weight.unit,
                    ),
                  ),
                );
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
