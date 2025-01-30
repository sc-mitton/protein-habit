import { useState, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, Pressable, useColorScheme } from "react-native";
import { Box, Text } from "@components";
import { useTheme } from "@shopify/restyle";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { BlurView } from "expo-blur";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setFont } from "@store/slices/uiSlice";
import { fontOptions } from "@constants/fonts";
import { RootScreenProps } from "@types";

const Appearance = (props: RootScreenProps<"Appearance">) => {
  const [firstRender, setFirstRender] = useState(true);
  const theme = useTheme();
  const selectedFont = useAppSelector((state) => state.ui.font);
  const dispatch = useAppDispatch();
  const mode = useColorScheme();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (firstRender) {
      timeout = setTimeout(() => {
        setFirstRender(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [firstRender]);

  return (
    <BottomSheet
      onClose={() => props.navigation.goBack()}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.colors.mainBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.tertiaryText,
      }}
      backdropComponent={() => (
        <Animated.View
          entering={FadeIn.delay(firstRender ? 300 : 0).duration(
            firstRender ? 300 : 0,
          )}
          exiting={FadeOut}
          style={StyleSheet.absoluteFillObject}
        >
          <Box
            style={StyleSheet.absoluteFillObject}
            opacity={0.5}
            backgroundColor="overlay"
            shadowOffset={{ width: 0, height: 4 }}
            shadowRadius={12}
            shadowOpacity={0.5}
          />
        </Animated.View>
      )}
    >
      <BottomSheetView>
        <Box
          backgroundColor="mainBackground"
          padding="l"
          paddingBottom="xxxl"
          borderTopLeftRadius="l"
          borderTopRightRadius="l"
        >
          <Box paddingBottom="l">
            <Text variant="header" marginBottom="l">
              Font
            </Text>
            <Box
              flexDirection="row"
              flexWrap="wrap"
              gap="xl"
              justifyContent="center"
            >
              {fontOptions.map((font) => (
                <Pressable key={font} onPress={() => dispatch(setFont(font))}>
                  <Box
                    borderWidth={2}
                    borderColor={
                      font === selectedFont ? "selected" : "unselected"
                    }
                    padding="s"
                    borderRadius="m"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize={32}
                      lineHeight={32}
                      variant={font === "inter" ? "bold" : font}
                      textTransform="capitalize"
                    >
                      Aa
                    </Text>
                  </Box>
                </Pressable>
              ))}
            </Box>
          </Box>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default Appearance;
