import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  searchInput: {
    paddingLeft: 24,
    marginVertical: -8,
  },
  searchIcon: {
    position: "absolute",
    top: Platform.OS === "android" ? 12 : 6,
    left: 12,
    marginTop: 1,
  },
  modal: {
    zIndex: 100,
  },
  sectionHeader: {
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
  },
  sectionList: {
    marginBottom: 24,
  },
  sectionListContent: {
    paddingBottom: 64,
  },
});

export default styles;
