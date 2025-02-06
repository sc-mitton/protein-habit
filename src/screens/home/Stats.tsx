import { memo } from "react";
import { PieChart, Target, BarChart2, Zap } from "geist-native-icons";
import dayjs from "dayjs";

import { Box, Text, Icon } from "@components";
import {
  selectDailyProteinTarget,
  selectTotalProteinForDay,
  selectWeeklyAvg,
  selectStreak,
} from "@store/slices/proteinSelectors";
import { useAppSelector } from "@store/hooks";

const Stats = () => {
  const dailyTarget = useAppSelector(selectDailyProteinTarget);
  const weeklyAvg = useAppSelector(selectWeeklyAvg);
  const totalProteinForDay = useAppSelector((state) =>
    selectTotalProteinForDay(state, dayjs().format("YYYY-MM-DD")),
  );
  const streak = useAppSelector(selectStreak);

  return (
    <Box justifyContent="center" flex={1} gap="l">
      <Box
        paddingHorizontal="l"
        paddingTop={"s"}
        flexDirection="row"
        gap="xxl"
        marginBottom="l"
      >
        <Box gap="s" flex={1}>
          <Box
            flexDirection={"row"}
            gap="s"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon icon={Target} accent={true} color="secondaryText" />
            <Text fontSize={14} accent={true} color="secondaryText">
              Daily Goal
            </Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <Text variant="bold" fontSize={18}>
              {dailyTarget}
            </Text>
            <Text variant="bold" fontSize={18}>
              g
            </Text>
          </Box>
        </Box>
        <Box gap="s" flex={1}>
          <Box
            flexDirection={"row"}
            gap="s"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon icon={PieChart} accent={true} color="secondaryText" />
            <Text color="secondaryText" fontSize={14} accent={true}>
              Remaining
            </Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <Text variant="bold" fontSize={18}>
              {Math.max(dailyTarget - totalProteinForDay, 0)}
            </Text>
            <Text variant="bold" fontSize={18}>
              g
            </Text>
          </Box>
        </Box>
      </Box>
      <Box paddingHorizontal="l" flexDirection="row" gap="xxl">
        <Box paddingBottom="s" gap="s" flex={1}>
          <Box
            flexDirection={"row"}
            gap="s"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon
              icon={BarChart2}
              strokeWidth={2}
              accent={true}
              color="secondaryText"
            />
            <Text color="secondaryText" fontSize={14} accent={true}>
              Daily Average
            </Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <Text variant="bold" fontSize={18}>
              {weeklyAvg}
            </Text>
            <Text variant="bold" fontSize={18}>
              g
            </Text>
          </Box>
        </Box>
        <Box paddingBottom="s" gap="s" flex={1}>
          <Box
            flexDirection={"row"}
            gap="s"
            paddingBottom="s"
            alignItems={"center"}
            borderColor="seperator"
            borderBottomWidth={1.5}
          >
            <Icon
              icon={Zap}
              strokeWidth={2}
              accent={true}
              color="secondaryText"
            />
            <Text color="secondaryText" fontSize={14} accent={true}>
              Streak
            </Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <Text variant="bold" fontSize={18}>
              {streak} days
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default memo(Stats);
