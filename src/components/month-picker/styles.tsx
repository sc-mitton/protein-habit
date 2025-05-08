import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  pagerContainer: {
    flexDirection: "row",
    marginLeft: 16,
  },
  pagerView: {
    flexGrow: 1,
    flex: 1,
    height: 260,
    marginBottom: 48,
  },
  calendarIcon: {
    marginRight: 0,
    marginBottom: 2,
  },
  gridContainer: {
    flex: 1,
    paddingTop: 12,
    alignItems: "center",
    gap: 24,
  },
  grid: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    gap: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    alignItems: "center",
    marginBottom: 4,
  },
  arrowButton: {
    transform: [{ scaleY: 1.2 }],
    opacity: 0.5,
  },
});

export default styles;
