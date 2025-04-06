import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SymbolView } from "expo-symbols";
import { useTheme } from "@shopify/restyle";

import { Box, Button, Icon } from "@components";
import { Bookmark } from "geist-native-icons";
import { RootStackParamList } from "@types";
import { Theme } from "@theme";

const HeaderRight = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme<Theme>();

  return (
    <Box flexDirection="row" gap="s">
      <Button
        padding="xss"
        backgroundColor="primaryButton"
        borderColor="matchBlurBackground"
        borderWidth={1.5}
        gap="m"
        marginBottom="s"
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
                size={18}
                color="secondaryText"
                borderColor="secondaryText"
              />
            }
          />
        }
      />
    </Box>
  );
};

export default HeaderRight;
