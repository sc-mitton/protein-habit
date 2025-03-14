import { useEffect } from "react";
import SlotNumbers from "react-native-slot-numbers";
import { Plus } from "geist-native-icons";
import ReAnimated, { LinearTransition } from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";

import styles from "./styles/home-screen";
import fontStyles from "@styles/fonts";
import { Box, Text, Button, Icon, DrumStickIcon } from "@components";
import { selectTotalProteinForDay } from "@store/slices/proteinSelectors";
import { useAppSelector } from "@store/hooks";
import { HomeScreenProps } from "@types";
import { dayFormat } from "@constants/formats";
import { selectFont } from "@store/slices/uiSlice";
import {
  selectUserPurchaseStatus,
  selectUserInception,
} from "@store/slices/userSlice";
import { baseIap } from "@constants/iaps";
import Tabs from "./Tabs";

const HomeMain = (props: HomeScreenProps<"Main">) => {
  const theme = useTheme();
  const purchaseStatus = useAppSelector(selectUserPurchaseStatus);
  const inceptionDate = useAppSelector(selectUserInception);
  const font = useAppSelector(selectFont);
  const totalProteinForDay = useAppSelector((state) =>
    selectTotalProteinForDay(state, dayjs().format(dayFormat)),
  );

  useEffect(() => {
    if (
      purchaseStatus === null &&
      dayjs().diff(dayjs(inceptionDate), "day") > 0
    ) {
      props.navigation.navigate("Purchase", { iap: baseIap });
    }
  }, [purchaseStatus]);

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box
        paddingHorizontal="m"
        marginTop="xxl"
        marginBottom="l"
        flexDirection="row"
        alignItems="center"
        gap="xl"
        justifyContent="flex-start"
      >
        <Box flexDirection="row" alignItems={"baseline"} gap="s">
          <SlotNumbers
            spring
            animateIntermediateValues
            value={totalProteinForDay}
            fontStyle={[
              styles.bigSlotNumbersStyle,
              { color: theme.colors.primaryText },
              fontStyles[font],
            ]}
          />
          <Text
            variant="bold"
            marginTop="xs"
            marginLeft="ns"
            fontSize={24}
            style={fontStyles[font]}
          >
            g
          </Text>
        </Box>
        <ReAnimated.View layout={LinearTransition} style={styles.buttons}>
          <Box flexDirection="row" gap="sm" paddingRight="m">
            <Button
              borderRadius="full"
              borderColor="borderColor"
              borderWidth={1.5}
              backgroundColor="transparent"
              padding="s"
              onPress={() => {
                props.navigation.navigate("Entry");
              }}
              icon={
                <Icon
                  icon={Plus}
                  size={20}
                  color="primaryText"
                  strokeWidth={2.5}
                />
              }
            />
            <Button
              borderRadius="full"
              borderColor="borderColor"
              borderWidth={1.5}
              backgroundColor="transparent"
              padding="s"
              onPress={() => {
                props.navigation.navigate("MyFoods");
              }}
              icon={
                <Icon
                  icon={DrumStickIcon}
                  color="primaryText"
                  strokeWidth={2}
                />
              }
            />
          </Box>
        </ReAnimated.View>
      </Box>
      <Tabs />
    </Box>
  );
};

export default HomeMain;
