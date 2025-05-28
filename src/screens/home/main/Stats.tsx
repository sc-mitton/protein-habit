import { memo, useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { SymbolView } from "expo-symbols";
import { Zap } from "geist-native-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { useTheme } from "@shopify/restyle";

import { Box, Text, Icon, ProgressPie } from "@components";
import {
  selectDailyProteinTarget,
  selectTotalProteinForDay,
  selectDailyAvg,
  selectStreak,
} from "@store/slices/proteinSelectors";
import {
  selectHasShownSuccessModal,
  setHasShownSuccessModal,
  selectAccent,
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
  const accent = useAppSelector(selectAccent);
  const streak = useAppSelector(selectStreak);

  const theme = useTheme();
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
    <Box
      justifyContent="flex-start"
      variant="homeTabSection"
      borderBottomLeftRadius="l"
      borderBottomRightRadius="l"
      marginTop="nml"
      paddingBottom="m"
    >
      <Box flexDirection="row" gap="xxxl" marginBottom="xxl">
        <Box gap="s" flex={1}>
          <Box
            flexDirection={"row"}
            gap="s"
            paddingBottom="s"
            alignItems={"center"}
          >
            <Box flexDirection="row" gap="s" alignItems="center">
              <Ionicons
                name="flag"
                size={18}
                color={
                  accent ? theme.colors[accent] : theme.colors.secondaryText
                }
              />
              <Text variant="miniHeader" accent={true} color="secondaryText">
                Daily Goal
              </Text>
            </Box>
          </Box>
          <Box flexDirection="row" gap="xxs" marginLeft="xxs">
            <Text variant="header">{dailyTarget}</Text>
            <Text variant="header">g</Text>
          </Box>
        </Box>
        <Box gap="s" flex={1}>
          <Box
            flexDirection={"row"}
            gap="s"
            paddingBottom="s"
            alignItems={"center"}
          >
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Remaining",
                  "How much protein you have left to reach your goal for the day.",
                )
              }
            >
              <Box flexDirection="row" gap="s" alignItems="center">
                <ProgressPie
                  progress={(dailyTarget - remainingProtein) / dailyTarget}
                />
                <Text color="secondaryText" variant="miniHeader" accent={true}>
                  Remaining
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Box flexDirection="row" gap="xxs" marginLeft="xxs">
            <Text variant="header">{remainingProtein}</Text>
            <Text variant="header">g</Text>
          </Box>
        </Box>
      </Box>
      <Box flexDirection="row" gap="xxxl">
        <Box paddingBottom="s" gap="s" flex={1}>
          <Box
            flexDirection={"row"}
            gap="s"
            paddingBottom="s"
            alignItems={"center"}
          >
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Daily Average",
                  "Average protein per day this week.",
                )
              }
            >
              <Box flexDirection="row" gap="s" alignItems="center">
                <SymbolView
                  name="chart.bar.xaxis"
                  tintColor={
                    accent ? theme.colors[accent] : theme.colors.secondaryText
                  }
                  size={20}
                  fallback={
                    <Entypo
                      name="bar-graph"
                      size={18}
                      color={
                        accent
                          ? theme.colors[accent]
                          : theme.colors.secondaryText
                      }
                    />
                  }
                />
                <Text color="secondaryText" variant="miniHeader" accent={true}>
                  Daily Average
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Box flexDirection="row" gap="xxs" marginLeft="xxs">
            <Text variant="header">{weeklyAvg}</Text>
            <Text variant="header">g</Text>
          </Box>
        </Box>
        <Box paddingBottom="s" gap="s" flex={1}>
          <Box
            flexDirection={"row"}
            gap="s"
            paddingBottom="s"
            alignItems={"center"}
          >
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Streak",
                  "The number of consecutive days you've reached your daily goal.",
                )
              }
            >
              <Box flexDirection="row" gap="s" alignItems="center">
                <Icon
                  icon={Zap}
                  accent={true}
                  size={18}
                  color="secondaryText"
                  borderColor="secondaryText"
                />
                <Text color="secondaryText" variant="miniHeader" accent={true}>
                  Streak
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Box flexDirection="row" gap="xs" marginLeft="xxs">
            <Text variant="header">{`${streak} day${streak === 1 ? "" : "s"}`}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Stats);
