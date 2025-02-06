import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, Pressable, Dimensions } from "react-native";
import { Box, Text } from "@components";
import { useTheme } from "@shopify/restyle";

import { BackDrop } from "@components";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  selectFont,
  setFont,
  selectAccent,
  setAccent,
} from "@store/slices/uiSlice";
import { fontOptions } from "@constants/fonts";
import { accentOptions } from "@constants/accents";
import { RootScreenProps } from "@types";

const Appearance = (props: RootScreenProps<"Appearance">) => {
  const theme = useTheme();
  const selectedFont = useAppSelector(selectFont);
  const selectedAccent = useAppSelector(selectAccent);
  const dispatch = useAppDispatch();

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
      backdropComponent={() => <BackDrop blurIntensity={0} />}
    >
      <BottomSheetView>
        <Box
          backgroundColor="mainBackground"
          padding="l"
          paddingBottom="xxxl"
          borderTopLeftRadius="l"
          borderTopRightRadius="l"
        >
          <Box
            borderBottomColor="seperator"
            borderBottomWidth={1.5}
            paddingBottom="s"
          >
            <Text variant="header">Font</Text>
          </Box>
          <Box
            flexDirection="row"
            flexWrap="wrap"
            gap="xl"
            marginTop="l"
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
          <Box
            borderBottomColor="seperator"
            borderBottomWidth={1.5}
            marginTop="xl"
            paddingBottom="s"
          >
            <Text variant="header">Accent</Text>
          </Box>
          <Box
            flexDirection="row"
            flexWrap="wrap"
            gap="m"
            marginTop="l"
            marginBottom="l"
            justifyContent="center"
          >
            {accentOptions.map((accent) => (
              <Pressable
                key={accent}
                onPress={() => {
                  if (accent === selectedAccent) {
                    dispatch(setAccent(undefined));
                  } else {
                    dispatch(setAccent(accent));
                  }
                }}
              >
                <Box
                  borderRadius="full"
                  borderWidth={2}
                  borderColor={
                    accent === selectedAccent ? "selected" : "transparent"
                  }
                  padding="xs"
                >
                  <Box
                    width={28}
                    height={28}
                    borderRadius="full"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={accent}
                  />
                  <Box
                    borderRadius="full"
                    style={[
                      styles.border,
                      {
                        borderColor: (theme.colors[accent] as string)
                          .replace(
                            /(\d+)%\)$/,
                            (match) => `${Math.max(0, parseInt(match) - 30)}%)`,
                          )
                          .replace(
                            /(\d+)%,/,
                            (match) => `${Math.max(0, parseInt(match) - 20)}%,`,
                          ),
                      },
                    ]}
                  />
                </Box>
              </Pressable>
            ))}
          </Box>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default Appearance;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: -Dimensions.get("window").width,
    left: 0,
    right: 0,
    bottom: -Dimensions.get("window").width,
  },
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    opacity: 1,
  },
});
