import { Platform } from "react-native";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bigSlotNumbersStyle: {
    fontSize: Platform.OS === "ios" ? 70 : 74,
    lineHeight: Platform.OS === "ios" ? 74 : 78,
    fontFamily: "Inter-Bold",
  },
  smallSlotNumbersStyle: {
    fontSize: 18,
    lineHeight: 18,
    fontFamily: "Inter-Bold",
  },
  buttonsContainer: {
    position: "absolute",
    right: 48,
    top: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    transform: [{ translateY: Platform.OS === "ios" ? -6 : 0 }],
  },
  bufferNumber: {
    position: "absolute",
    right: -2,
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default styles;
