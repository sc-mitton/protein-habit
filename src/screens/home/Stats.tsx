import { memo, useEffect } from "react";
import { PieChart, Target, BarChart2, Zap } from "geist-native-icons";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";

import { Box, Text, Icon } from "@components";
import {
  selectDailyProteinTarget,
  selectTotalProteinForDay,
  selectDailyAvg,
  selectStreak,
} from "@store/slices/proteinSelectors";
import {
  selectHasShownSuccessModal,
  setHasShownSuccessModal,
} from "@store/slices/uiSlice";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { dayFormat } from "@constants/formats";

const Stats = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const dailyTarget = useAppSelector(selectDailyProteinTarget);
  const hasShownSuccessModal = useAppSelector(selectHasShownSuccessModal);
  const weeklyAvg = useAppSelector((state) =>
    selectDailyAvg(state, dayjs().startOf("week").format(dayFormat)),
  );
  const totalProteinForDay = useAppSelector((state) =>
    selectTotalProteinForDay(state, dayjs().format("YYYY-MM-DD")),
  );
  const streak = useAppSelector(selectStreak);

  const remainingProtein = Math.max(dailyTarget - totalProteinForDay, 0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (remainingProtein === 0 && !hasShownSuccessModal) {
      timeout = setTimeout(() => {
        dispatch(setHasShownSuccessModal(true));
        navigation.navigate("SuccessModal");
      }, 1000);
    } else if (remainingProtein > 0) {
      dispatch(setHasShownSuccessModal(false));
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [remainingProtein, navigation, dispatch, hasShownSuccessModal]);

  return (
    <Box justifyContent="center" flex={1} gap="l">
      <Box
        paddingHorizontal="l"
        paddingTop={"s"}
        flexDirection="row"
        gap="xxxl"
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
              {remainingProtein}
            </Text>
            <Text variant="bold" fontSize={18}>
              g
            </Text>
          </Box>
        </Box>
      </Box>
      <Box paddingHorizontal="l" flexDirection="row" gap="xxxl">
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
            <Icon icon={Zap} accent={true} color="secondaryText" />
            <Text color="secondaryText" fontSize={14} accent={true}>
              Streak
            </Text>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xs">
            <Text variant="bold" fontSize={18}>
              {`${streak} day${streak === 1 ? "" : "s"}`}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Stats);
