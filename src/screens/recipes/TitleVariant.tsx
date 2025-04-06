import { useState } from "react";
import { Platform, Image, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import _ from "lodash";

import { Box, Button, Text } from "@components";
import { useRecipesScreenContext } from "./Context";
import images from "./images";

const styles = StyleSheet.create({
  image: {
    width: 32,
    height: 32,
  },
});

const TitleVariant = () => {
  const { selectedFilters } = useRecipesScreenContext();
  const [showLabels, setShowLabels] = useState(false);

  return (
    <View>
      {showLabels ? (
        <Animated.View entering={FadeIn}>
          <Button
            onPress={() => setShowLabels(!showLabels)}
            flexDirection="row"
            padding="none"
          >
            <Text fontSize={14} color="secondaryText">
              {Object.keys(selectedFilters)
                .map((f) => selectedFilters[f as keyof typeof selectedFilters])
                .map((f) =>
                  f
                    ?.split("_")
                    .map((word) => _.capitalize(word))
                    .join(" "),
                )
                .join(", ")}
            </Text>
          </Button>
        </Animated.View>
      ) : (
        <Button
          onPress={() => setShowLabels(!showLabels)}
          flexDirection="row"
          padding="none"
          gap="nl"
          marginRight="nm"
          marginBottom="m"
          marginLeft={Platform.OS == "android" ? "s" : undefined}
        >
          {Object.keys(selectedFilters).map((filter) => (
            <Animated.View entering={FadeIn} key={filter}>
              <Box
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
                marginLeft={"nm"}
                marginBottom={Platform.OS === "android" ? "nm" : undefined}
                backgroundColor="primaryButton"
                borderColor="matchBlurBackground"
                borderWidth={1.5}
                padding="xxs"
              >
                <Image
                  source={images[(selectedFilters as any)[filter]]}
                  style={styles.image}
                />
              </Box>
            </Animated.View>
          ))}
        </Button>
      )}
    </View>
  );
};

export default TitleVariant;
