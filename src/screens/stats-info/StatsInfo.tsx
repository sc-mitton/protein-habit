import { View, StyleSheet } from "react-native";
import { PieChart, Target, BarChart2, Zap } from "geist-native-icons";

import { Box, BackDrop, Button, Icon, Text } from "@components";
import { RootScreenProps } from "@types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    transform: [{ translateY: 32 }],
  },
});

const StatsInfo = ({ navigation }: RootScreenProps<"StatsInfo">) => {
  return (
    <View style={styles.container}>
      <BackDrop />
      <Box
        backgroundColor="secondaryBackground"
        width="100%"
        borderRadius="xl"
        justifyContent="space-between"
        padding="l"
      >
        <Box>
          <Box
            flexDirection={"row"}
            gap="s"
            marginTop="m"
            paddingVertical="s"
            alignItems={"center"}
          >
            <Icon icon={PieChart} accent={true} color="secondaryText" />
            <Text color="secondaryText" fontSize={14} accent={true}>
              Remaining
            </Text>
          </Box>
          <Text variant="body" color="secondaryText">
            The number of grams of protein you have left to meet your goal for
            the day.
          </Text>
          <Box
            flexDirection={"row"}
            gap="s"
            marginTop="m"
            paddingVertical="s"
            alignItems={"center"}
          >
            <Icon icon={Target} accent={true} color="secondaryText" />
            <Text color="secondaryText" fontSize={14} accent={true}>
              Target
            </Text>
          </Box>
          <Text variant="body" color="secondaryText">
            Your protein goal for the day. Your goal is set automatically at 0.7
            grams per pound of body weight, but you can also modify this goal as
            you prefer.
          </Text>
          <Box flexDirection={"row"} gap="s" marginTop="m" paddingVertical="s">
            <Icon icon={BarChart2} accent={true} color="secondaryText" />
            <Text color="secondaryText" fontSize={14} accent={true}>
              History
            </Text>
          </Box>
          <Text variant="body" color="secondaryText">
            The average amount of protein per day for the current week starting
            from the beginning of the week.
          </Text>
          <Box flexDirection={"row"} gap="s" marginTop="m" paddingVertical="s">
            <Icon icon={Zap} accent={true} color="secondaryText" />
            <Text color="secondaryText" fontSize={14} accent={true}>
              Streek
            </Text>
          </Box>
          <Text variant="body" color="secondaryText">
            The number of days in a row you have met your protein goal.
          </Text>
        </Box>
        <Button
          label="Dismiss"
          variant="primary"
          marginTop="l"
          onPress={() => navigation.goBack()}
        />
      </Box>
    </View>
  );
};

export default StatsInfo;
