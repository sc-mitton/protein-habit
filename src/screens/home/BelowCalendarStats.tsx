import { View, StyleSheet } from "react-native";
import { Text } from "@components";

export const BelowCalendarStats = ({
  proteinMonthlyDailyAverage,
}: {
  proteinMonthlyDailyAverage: { avgProteinPerDay: number };
}) => (
  <View style={styles.proteinStatsContainer}>
    <View style={styles.proteinStats}>
      <Text
        fontSize={14}
        color="tertiaryText"
        marginRight="xs"
        variant="medium"
      >
        Averaged
      </Text>
      <Text fontSize={14} color="tertiaryText" variant="medium">
        {proteinMonthlyDailyAverage.avgProteinPerDay}
      </Text>
      <Text fontSize={14} color="tertiaryText" variant="medium">
        g
      </Text>
      <Text fontSize={14} color="tertiaryText" variant="medium" marginLeft="xs">
        / day
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  proteinStatsContainer: {
    position: "absolute",
    bottom: -16,
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  proteinStats: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "baseline",
  },
});
