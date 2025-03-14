import { memo, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";
import { SymbolView } from "expo-symbols";
import { Zap } from "geist-native-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import Entypo from "@expo/vector-icons/Entypo";
import { useTheme } from "@shopify/restyle";

import { Box, Text, Tip, Button, Icon } from "@components";
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
  const accent = useAppSelector(selectAccent);
  const streak = useAppSelector(selectStreak);

  const theme = useTheme();
  const remainingProtein = Math.max(dailyTarget - totalProteinForDay, 0);
  const { height } = useWindowDimensions();
  const [collapseCalendar, setCollapseCalendar] = useState(
    Device.osName === "iPadOS" || height < 800,
  );

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
      <Box>
        <Box
          paddingHorizontal="l"
          flexDirection="row"
          gap="xxxl"
          marginBottom="xl"
        >
          <Box
            gap="s"
            flex={1}
            marginVertical={collapseCalendar ? "l" : "none"}
          >
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
                  <Ionicons
                    name="flag"
                    size={18}
                    color={
                      accent ? theme.colors[accent] : theme.colors.secondaryText
                    }
                  />
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
          <Box
            gap="s"
            flex={1}
            marginVertical={collapseCalendar ? "l" : "none"}
          >
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
                  <Entypo
                    name="pie-chart"
                    size={18}
                    color={
                      accent ? theme.colors[accent] : theme.colors.secondaryText
                    }
                  />
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
        <Box
          paddingHorizontal="l"
          flexDirection="row"
          gap="xxxl"
          marginBottom="s"
        >
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
                  <Icon
                    icon={Zap}
                    accent={true}
                    size={18}
                    color="secondaryText"
                    borderColor="secondaryText"
                  />
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
      {collapseCalendar ? (
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
            icon={
              <Ionicons
                name="calendar"
                size={24}
                color={accent ? theme.colors[accent] : theme.colors.primaryText}
              />
            }
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
