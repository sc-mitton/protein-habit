import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SymbolView } from "expo-symbols";
import { useTheme } from "@shopify/restyle";
import { Platform, useColorScheme } from "react-native";
import { Box, Button, Icon } from "@components";
import { Bookmark } from "geist-native-icons";
import { RootStackParamList } from "@types";
import { Theme } from "@theme";

const HeaderRight = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme<Theme>();
  const scheme = useColorScheme();

  return (
    <Box flexDirection="row" gap="s">
      <Button
        padding="xss"
        backgroundColor={
          Platform.OS === "ios" ? "primaryButton" : "transparent"
        }
        borderColor={scheme == "dark" ? "matchBlurBackground" : "transparent"}
        borderWidth={1.5}
        gap="m"
        marginBottom={Platform.OS === "ios" ? "s" : "none"}
        onPress={() => {
          navigation.navigate("BookmarkedRecipes");
        }}
        icon={
          <SymbolView
            name="bookmark.fill"
            size={20}
            tintColor={theme.colors.secondaryText}
            fallback={
              <Icon
                icon={Bookmark}
                size={20}
                color="primaryText"
                borderColor="primaryText"
              />
            }
          />
        }
      />
    </Box>
  );
};

export default HeaderRight;
