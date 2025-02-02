import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 10,
    width: "100%",
  },
  titleContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  seperator: {
    width: "200%",
    transform: [{ translateX: -300 }],
  },
});

export default styles;
