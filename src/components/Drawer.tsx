import { StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Home, Book } from "geist-native-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Box, Text, Button, BackDrop } from "@components";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.7;

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 100,
  },
});

export const Drawer = () => {
  const navigation = useNavigation<any>();

  return (
    <>
      <BackDrop onPress={() => navigation.goBack()} />
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.drawer}>
        <Box
          flex={1}
          backgroundColor="secondaryBackground"
          padding="l"
          paddingTop="xxxl"
        >
          <Box gap="l">
            <Button
              onPress={() => {
                navigation.navigate("Home");
                navigation.goBack();
              }}
              flexDirection="row"
              alignItems="center"
              gap="m"
            >
              <Home size={24} />
              <Text variant="bold">Home</Text>
            </Button>
            <Button
              onPress={() => {
                navigation.navigate("Recipes");
                navigation.goBack();
              }}
              flexDirection="row"
              alignItems="center"
              gap="m"
            >
              <Book size={24} />
              <Text variant="bold">Recipes</Text>
            </Button>
          </Box>
        </Box>
      </Animated.View>
    </>
  );
};

export default Drawer;
