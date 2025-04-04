import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RecipesScreenProps } from "../../../types/navigation";

type Props = RecipesScreenProps<"Detail">;

const DetailScreen: React.FC<Props> = ({ route }) => {
  const { recipe } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {recipe.description || "Untitled Recipe"}
      </Text>
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

export default DetailScreen;
