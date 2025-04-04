import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RecipesScreenProps } from "../../../types/navigation";

type Props = RecipesScreenProps<"Explore">;

const ExploreScreen: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Recipes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ExploreScreen;
