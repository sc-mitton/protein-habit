import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import Entypo from "@expo/vector-icons/Entypo";
import { useTheme } from "@shopify/restyle";
import { SymbolView } from "expo-symbols";
import { StyleSheet } from "react-native";
import { Box, Text, Button } from "@components";
import { ProfileScreenProps } from "@types";
import { useAppSelector } from "@store/hooks";
import { selectUserInfo } from "@store/slices/userSlice";
import { selectAccent } from "@store/slices/uiSlice";
import { Alert } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 94,
  },
});

const ProfileNavList = (props: ProfileScreenProps<"ProfileNavList">) => {
  const accent = useAppSelector(selectAccent);
  const { name } = useAppSelector(selectUserInfo);
  const theme = useTheme();

  return (
    <Box backgroundColor="mainBackground" padding="m" style={styles.container}>
      <Box alignItems="center" gap="s">
        <Box
          backgroundColor={accent}
          width={48}
          height={48}
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="header" color="white">
            {name.charAt(0)}
          </Text>
        </Box>
        <Text marginBottom="l" variant="bold">
          {name}
        </Text>
      </Box>
      <Box flexDirection="row" gap="m" marginHorizontal="s" marginTop="l">
        <Box flex={1}>
          <Button
            onPress={() => props.navigation.navigate("PersonalInfoModal")}
            variant="squareCardButton"
            icon={
              <SymbolView
                name="person.crop.circle.fill"
                size={24}
                tintColor={theme.colors.primaryText}
                fallback={
                  <Ionicons
                    name="person-circle-sharp"
                    size={24}
                    color={theme.colors.primaryText}
                  />
                }
              />
            }
            label="Personal Info"
          />
        </Box>
        <Box flex={1}>
          <Button
            onPress={() => props.navigation.navigate("AppearanceModal")}
            variant="squareCardButton"
            label="Appearance"
            icon={
              <SymbolView
                name="paintbrush.pointed.fill"
                size={24}
                tintColor={theme.colors.primaryText}
                fallback={
                  <Entypo
                    name="brush"
                    size={20}
                    color={theme.colors.primaryText}
                  />
                }
              />
            }
          />
        </Box>
      </Box>
      <Box flexDirection="row" gap="m" marginHorizontal="s">
        <Box flex={1}>
          <Button
            onPress={() => props.navigation.navigate("EditDailyGoalModal")}
            variant="squareCardButton"
            flexDirection="column"
            label="Edit Daily Goal"
            icon={
              <SymbolView
                name="flag.fill"
                size={24}
                tintColor={theme.colors.primaryText}
                fallback={
                  <Foundation
                    name="flag"
                    size={20}
                    color={theme.colors.primaryText}
                  />
                }
              />
            }
          />
        </Box>
        <Box flex={1}>
          <Button
            onPress={() =>
              Alert.alert(
                "Help",
                "If you need help, please reach out to us at contact@northof60labs.com",
              )
            }
            variant="squareCardButton"
            flexDirection="column"
            label="Help"
            icon={
              <SymbolView
                name="questionmark.circle.fill"
                size={24}
                tintColor={theme.colors.primaryText}
                fallback={
                  <Ionicons
                    name="help-circle-sharp"
                    size={20}
                    color={theme.colors.primaryText}
                  />
                }
              />
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileNavList;
