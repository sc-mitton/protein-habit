import { memo, useEffect } from "react";
import {
  PieChart,
  Target,
  BarChart2,
  Zap,
  Calendar as CalendarIcon,
} from "geist-native-icons";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";

import { Box, Text, Icon, Tip, Button } from "@components";
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
import Calendar from "./Calendar";

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
    <Box justifyContent="flex-start" flex={1} paddingVertical="xl">
      <Box flex={1} gap="xl" justifyContent="flex-start">
        <Box paddingHorizontal="l" flexDirection="row" gap="xxxl">
          <Box gap="s" flex={1}>
            <Box
              flexDirection={"row"}
              gap="s"
              paddingBottom="s"
              alignItems={"center"}
              borderColor="seperator"
              borderBottomWidth={1.5}
            >
              <Tip
                label="Your current daily protein goal."
                maxWidth={125}
                offset={12}
              >
                <Box flexDirection="row" gap="s" alignItems="center">
                  <Icon icon={Target} accent={true} color="secondaryText" />
                  <Text
                    variant="miniHeader"
                    accent={true}
                    color="secondaryText"
                  >
                    Daily Goal
                  </Text>
                </Box>
              </Tip>
            </Box>
            <Box flexDirection="row" gap="xs" marginLeft="xs">
              <Text fontSize={18}>{dailyTarget}</Text>
              <Text fontSize={18}>g</Text>
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
              <Tip label="How much protein you have left to reach your goal for the day.">
                <Box flexDirection="row" gap="s" alignItems="center">
                  <Icon icon={PieChart} accent={true} color="secondaryText" />
                  <Text
                    color="secondaryText"
                    variant="miniHeader"
                    accent={true}
                  >
                    Remaining
                  </Text>
                </Box>
              </Tip>
            </Box>
            <Box flexDirection="row" gap="xs" marginLeft="xs">
              <Text fontSize={18}>{remainingProtein}</Text>
              <Text fontSize={18}>g</Text>
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
              <Tip
                label="Average protein per day this week."
                maxWidth={150}
                offset={8}
              >
                <Box flexDirection="row" gap="s" alignItems="center">
                  <Icon
                    icon={BarChart2}
                    strokeWidth={2}
                    accent={true}
                    color="secondaryText"
                  />
                  <Text
                    color="secondaryText"
                    variant="miniHeader"
                    accent={true}
                  >
                    Daily Average
                  </Text>
                </Box>
              </Tip>
            </Box>
            <Box flexDirection="row" gap="xs" marginLeft="xs">
              <Text fontSize={18}>{weeklyAvg}</Text>
              <Text fontSize={18}>g</Text>
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
              <Tip label="The number of consecutive days you've reached your daily goal.">
                <Box flexDirection="row" gap="s" alignItems="center">
                  <Icon icon={Zap} accent={true} color="secondaryText" />
                  <Text
                    color="secondaryText"
                    variant="miniHeader"
                    accent={true}
                  >
                    Streak
                  </Text>
                </Box>
              </Tip>
            </Box>
            <Box flexDirection="row" gap="xs" marginLeft="xs">
              <Text fontSize={18}>
                {`${streak} day${streak === 1 ? "" : "s"}`}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      {Device.osName === "iPadOS" ? (
        <Box
          justifyContent="center"
          alignItems="center"
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          padding="m"
          zIndex={100}
        >
          <Button
            marginVertical="m"
            borderColor="borderColor"
            borderWidth={1.5}
            borderRadius="full"
            icon={<Icon icon={CalendarIcon} size={24} />}
            onPress={() => navigation.navigate("Calendar")}
          />
        </Box>
      ) : (
        <Calendar />
      )}
    </Box>
  );
};

export default memo(Stats);
