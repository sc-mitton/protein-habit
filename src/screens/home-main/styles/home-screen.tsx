import { Platform } from "react-native";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bigSlotNumbersStyle: {
    fontSize: Platform.OS === "ios" ? 82 : 86,
    lineHeight: Platform.OS === "ios" ? 82 : 86,
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
    transform: [{ translateY: -6 }],
  },
  bufferNumber: {
    position: "absolute",
    right: -2,
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
