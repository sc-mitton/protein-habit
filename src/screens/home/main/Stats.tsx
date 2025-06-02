import { memo, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useTheme } from "@shopify/restyle";
import { DuoTone } from "react-native-color-matrix-image-filters";
import { lightenColor } from "@utils";

import { Box, Text } from "@components";
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
import flag from "@assets/3dicons/flag.png";
import pie from "@assets/3dicons/pie.png";
import bolt from "@assets/3dicons/bolt.png";
import bar from "@assets/3dicons/bar.png";

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const TintImage = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const accent = useAppSelector(selectAccent);
  const scheme = useColorScheme();

  const firstColor = lightenColor(
    scheme === "dark" ? 5 : 20,
    theme.colors[accent],
  );
  const secondColor = lightenColor(
    scheme === "dark" ? -50 : -10,
    theme.colors[accent],
  );

  return accent ? (
    <DuoTone firstColor={`#${firstColor}`} secondColor={`#${secondColor}`}>
      {children}
    </DuoTone>
  ) : (
    <Box opacity={0.7}>{children}</Box>
  );
};

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
    <Box
      justifyContent="flex-start"
      variant="homeTabSection"
      borderBottomLeftRadius="l"
      borderBottomRightRadius="l"
      marginTop="nml"
      paddingBottom="m"
    >
      <Box flexDirection="row" gap="xxxl" marginBottom="xl">
        <Box flex={1}>
          <Box
            flexDirection={"row"}
            gap="s"
            paddingBottom="s"
            alignItems={"center"}
          >
            <Box flexDirection="row" gap="xs" alignItems="center">
              <TintImage>
                <Image source={flag} style={styles.icon} />
              </TintImage>
              <Text variant="body" accent={true} color="secondaryText">
                Daily Goal
              </Text>
            </Box>
          </Box>
          <Box flexDirection="row" gap="xxs" marginLeft="xxs">
            <Text variant="header">{dailyTarget}</Text>
            <Text variant="header">g</Text>
          </Box>
        </Box>
        <Box flex={1}>
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
                <TintImage>
                  <Image source={pie} style={styles.icon} />
                </TintImage>
                <Text color="secondaryText" variant="body" accent={true}>
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
        <Box paddingBottom="s" flex={1}>
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
                <TintImage>
                  <Image source={bar} style={styles.icon} />
                </TintImage>
                <Text color="secondaryText" accent={true}>
                  Daily Avg.
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
          <Box flexDirection="row" gap="xxs" marginLeft="xxs">
            <Text variant="header">{weeklyAvg}</Text>
            <Text variant="header">g</Text>
          </Box>
        </Box>
        <Box paddingBottom="s" flex={1}>
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
                <TintImage>
                  <Image source={bolt} style={styles.icon} />
                </TintImage>
                <Text color="secondaryText" variant="body" accent={true}>
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
