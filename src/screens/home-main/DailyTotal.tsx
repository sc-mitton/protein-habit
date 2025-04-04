import SlotNumbers from "react-native-slot-numbers";
import { Plus } from "geist-native-icons";
import ReAnimated, { LinearTransition } from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";

import styles from "./styles/home-screen";
import fontStyles from "@styles/fonts";
import { Box, Text, Button, Icon, DrumStickIcon } from "@components";
import { useAppSelector } from "@store/hooks";
import { selectTotalProteinForDay } from "@store/slices/proteinSelectors";
import { dayFormat } from "@constants/formats";
import { HomeScreenProps } from "@types";
import { selectFont } from "@store/slices/uiSlice";

const DailyTotal = (props: HomeScreenProps<"Main">) => {
  const theme = useTheme();
  const font = useAppSelector(selectFont);
  const totalProteinForDay = useAppSelector((state) =>
    selectTotalProteinForDay(state, dayjs().format(dayFormat)),
  );

  return (
    <Box
      paddingHorizontal="m"
      marginTop="l"
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
          value={Number(totalProteinForDay.toString().replace(".", ""))}
          precision={totalProteinForDay.toString().split(".")[1]?.length || 0}
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
          lineHeight={28}
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
              props.navigation.navigate("EntryModal");
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
              props.navigation.navigate("MyFoodsModal");
            }}
            icon={
              <Icon icon={DrumStickIcon} color="primaryText" strokeWidth={2} />
            }
          />
        </Box>
      </ReAnimated.View>
    </Box>
  );
};

export default DailyTotal;
