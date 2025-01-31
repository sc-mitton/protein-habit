import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bigSlotNumbersStyle: {
    fontSize: 64,
    lineHeight: 64,
    fontFamily: "Inter-Bold",
  },
  smallSlotNumbersStyle: {
    fontSize: 18,
    lineHeight: 18,
    fontFamily: "Inter-Bold",
  },
  inter: {
    fontFamily: "Inter-Bold",
  },
  nyHeavy: {
    fontFamily: "NewYork-Heavy",
  },
  sfRails: {
    fontFamily: "SFPro-SemiboldRails",
  },
  sfStencil: {
    fontFamily: "SFPro-SemiboldStencil",
  },
  buttonsContainer: {
    position: "absolute",
    right: 48,
    top: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    position: "absolute",
  },
  bufferNumber: {
    position: "absolute",
    right: 32,
    top: -16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
