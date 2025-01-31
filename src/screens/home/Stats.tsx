import SlotNumbers from "react-native-slot-numbers";
import { useTheme } from "@shopify/restyle";
import { PieChart, Target, BarChart2, Zap } from "geist-native-icons";
import dayjs from "dayjs";

import styles from "./styles/home-screen";
import { Box, Text, Icon } from "@components";
import {
  selectDailyProteinTarget,
  selectTotalProteinForDay,
  selectWeeklyAvgProtein,
  selectStreak,
} from "@store/slices/proteinSlice";
import { useAppSelector } from "@store/hooks";

const Stats = () => {
  const theme = useTheme();

  const dailyTarget = useAppSelector(selectDailyProteinTarget);
  const weeklyAvg = useAppSelector(selectWeeklyAvgProtein);
  const totalProteinForDay = useAppSelector((state) =>
    selectTotalProteinForDay(state, dayjs().format("MM-DD-YYYY")),
  );
  const streak = useAppSelector(selectStreak);

  return (
    <Box
      flex={2.5}
      justifyContent="center"
      shadowColor="secondaryText"
      backgroundColor="mainBackground"
      shadowOffset={{ width: 0, height: -2 }}
      shadowOpacity={0.05}
      shadowRadius={1}
      elevation={1}
    >
      <Box
        paddingHorizontal="l"
        paddingTop={"s"}
        flexDirection="row"
        gap="xxl"
        marginBottom="l"
      >
        <Box gap="xs" flex={1}>
          <Box
            flexDirection={"row"}
            gap="xs"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon icon={Target} />
            <Text color="secondaryText" fontSize={14}>
              Daily Goal
            </Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <Text variant="bold">{dailyTarget}</Text>
            <Text variant="bold">g</Text>
          </Box>
        </Box>
        <Box gap="xs" flex={1}>
          <Box
            flexDirection={"row"}
            gap="xs"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon icon={PieChart} />
            <Text color="secondaryText" fontSize={14}>
              Remaining
            </Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <SlotNumbers
              value={dailyTarget - totalProteinForDay}
              fontStyle={[
                styles.smallSlotNumbersStyle,
                { color: theme.colors.primaryText },
              ]}
            />
            <Text variant="bold">g</Text>
          </Box>
        </Box>
      </Box>
      <Box paddingHorizontal="l" flexDirection="row" gap="xxl">
        <Box paddingBottom="s" gap="xs" flex={1}>
          <Box
            flexDirection={"row"}
            gap="xs"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon icon={BarChart2} strokeWidth={2} />
            <Text color="secondaryText" fontSize={14}>
              Daily Average
            </Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <Text variant="bold">{weeklyAvg}</Text>
            <Text variant="bold">g</Text>
          </Box>
        </Box>
        <Box paddingBottom="s" gap="xs" flex={1}>
          <Box
            flexDirection={"row"}
            gap="xs"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon icon={Zap} strokeWidth={2} />
            <Text color="secondaryText" fontSize={14} marginLeft="xs">
              Streak
            </Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <Text variant="bold">{streak}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Stats;
