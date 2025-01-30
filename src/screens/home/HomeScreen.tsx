import SlotNumbers from "react-native-slot-numbers";
import { useTheme } from "@shopify/restyle";
import { PieChart, Target } from "geist-native-icons";
import dayjs from "dayjs";

import styles from "./styles/home-screen";
import { Box, Text, Icon } from "@components";
import {
  selectDailyTarget,
  selectTotalProteinForDay,
} from "@store/slices/proteinSlice";
import { useAppSelector } from "@store/hooks";
import { RootScreenProps } from "@types";
import { selectFont } from "@store/slices/uiSlice";
import Calendar from "./Calendar";

const HomeScreen = (props: RootScreenProps<"Home">) => {
  const theme = useTheme();

  const font = useAppSelector(selectFont);
  const { name } = useAppSelector((state) => state.user);
  const dailyTarget = useAppSelector(selectDailyTarget);
  const totalProteinForDay = useAppSelector((state) =>
    selectTotalProteinForDay(state, dayjs().toISOString()),
  );

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box paddingHorizontal="m">
        <Text variant="header">Welcome, {name}</Text>
        <Text variant="subheader">{dayjs().format("MMM D, YYYY")}</Text>
      </Box>
      <Box
        padding="m"
        marginTop="l"
        marginBottom="s"
        flexDirection="row"
        alignItems={"baseline"}
        gap="s"
      >
        <SlotNumbers
          spring
          value={totalProteinForDay}
          fontStyle={[
            styles.bigSlotNumbersStyle,
            { color: theme.colors.primaryText },
            styles[font],
          ]}
        />
        <Text
          variant="bold"
          marginTop="xs"
          marginLeft="ns"
          fontSize={20}
          style={styles[font]}
        >
          grams
        </Text>
      </Box>
      <Box
        paddingHorizontal="l"
        paddingVertical={"s"}
        flexDirection="row"
        gap="l"
      >
        <Box justifyContent="flex-end" paddingBottom="s" gap="xs">
          <Box
            flexDirection={"row"}
            gap="xs"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon icon={Target} />
            <Text color="secondaryText">Daily Target</Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <Text variant="bold">{dailyTarget}</Text>
            <Text variant="bold">g</Text>
          </Box>
        </Box>
        <Box justifyContent="flex-end" paddingBottom="s" gap="xs">
          <Box
            flexDirection={"row"}
            gap="xs"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon icon={PieChart} />
            <Text color="secondaryText">Left</Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <SlotNumbers
              spring
              value={totalProteinForDay}
              fontStyle={[
                styles.smallSlotNumbersStyle,
                { color: theme.colors.primaryText },
              ]}
            />
            <Text variant="bold">g</Text>
          </Box>
        </Box>
      </Box>
      <Calendar />
    </Box>
  );
};

export default HomeScreen;
