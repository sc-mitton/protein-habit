import { Platform } from "react-native";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  largeSlotNumbersStyle: {
    fontSize: Platform.OS === "ios" ? 82 : 84,
    lineHeight: Platform.OS === "ios" ? 86 : 88,
  },
  smallSlotNumbersStyle: {
    fontSize: 28,
    lineHeight: 28,
    fontFamily: "Inter-Bold",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
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
