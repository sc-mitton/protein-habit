import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  searchInput: {
    paddingLeft: 28,
  },
  searchIcon: {
    position: "absolute",
    top: "75%",
    left: 16,
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
    paddingBottom: 0,
  },
});

export default styles;
