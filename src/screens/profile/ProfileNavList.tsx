import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import Entypo from "@expo/vector-icons/Entypo";
import { useTheme } from "@shopify/restyle";
import { Alert, StyleSheet, TouchableHighlight } from "react-native";
import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";

import { Box, Text, Button } from "@components";
import { useAppSelector } from "@store/hooks";
import { selectUserInfo } from "@store/slices/userSlice";
import { BottomTabsScreenProps } from "@types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 94,
  },
});

const ProfileNavList = (props: BottomTabsScreenProps<"Profile">) => {
  const { name } = useAppSelector(selectUserInfo);
  const theme = useTheme();

  return (
    <Box backgroundColor="mainBackground" padding="m" style={styles.container}>
      <Box alignItems="center" gap="s">
        <Box
          accent
          backgroundColor={"tertiaryText"}
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
          <TouchableHighlight
            underlayColor={theme.colors.primaryText}
            activeOpacity={0.97}
            style={{
              borderRadius: 15,
            }}
            onPress={() => props.navigation.navigate("PersonalInfoModal")}
          >
            <Box
              backgroundColor="secondaryBackground"
              paddingTop="ml"
              flexDirection="column"
              alignItems="flex-start"
              gap="s"
              padding="m"
              borderRadius="l"
              shadowColor="defaultShadow"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.1}
              shadowRadius={3}
              elevation={5}
            >
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
              <Text>Personal Info</Text>
            </Box>
          </TouchableHighlight>
        </Box>
        <Box flex={1}>
          <TouchableHighlight
            underlayColor={theme.colors.primaryText}
            activeOpacity={0.97}
            style={{
              borderRadius: 15,
            }}
            onPress={() => props.navigation.navigate("AppearanceModal")}
          >
            <Box
              backgroundColor="secondaryBackground"
              paddingTop="ml"
              flexDirection="column"
              alignItems="flex-start"
              gap="s"
              padding="m"
              borderRadius="l"
              shadowColor="defaultShadow"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.1}
              shadowRadius={3}
              elevation={5}
            >
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
              <Text>Appearance</Text>
            </Box>
          </TouchableHighlight>
        </Box>
      </Box>
      <Box flexDirection="row" gap="m" marginHorizontal="s" marginTop="m">
        <Box flex={1}>
          <TouchableHighlight
            underlayColor={theme.colors.primaryText}
            activeOpacity={0.97}
            style={{
              borderRadius: 15,
            }}
            onPress={() => props.navigation.navigate("EditDailyGoalModal")}
          >
            <Box
              backgroundColor="secondaryBackground"
              paddingTop="ml"
              flexDirection="column"
              alignItems="flex-start"
              gap="s"
              padding="m"
              borderRadius="l"
              shadowColor="defaultShadow"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.1}
              shadowRadius={3}
              elevation={5}
            >
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
              <Text>Edit Daily Goal</Text>
            </Box>
          </TouchableHighlight>
        </Box>
        <Box flex={1}>
          <TouchableHighlight
            underlayColor={theme.colors.primaryText}
            activeOpacity={0.97}
            style={{
              borderRadius: 15,
            }}
            onPress={() =>
              Alert.alert(
                "Help",
                "If you need help, please reach out to us at contact@northof60labs.com.",
              )
            }
          >
            <Box
              backgroundColor="secondaryBackground"
              paddingTop="ml"
              flexDirection="column"
              alignItems="flex-start"
              gap="s"
              padding="m"
              borderRadius="l"
              shadowColor="defaultShadow"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.1}
              shadowRadius={3}
              elevation={5}
            >
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
              <Text>Help</Text>
            </Box>
          </TouchableHighlight>
        </Box>
      </Box>
      <Box
        flexDirection="row"
        gap="s"
        alignItems="center"
        marginTop="l"
        justifyContent="center"
      >
        <Button
          textColor="tertiaryText"
          fontSize={13}
          label="Terms"
          padding="none"
          onPress={() => {
            WebBrowser.openBrowserAsync(
              "https://www.northof60labs.com/proteinhabit/terms",
            );
          }}
        />
        <Text color="tertiaryText" fontSize={10}>
          &bull;
        </Text>
        <Button
          textColor="tertiaryText"
          fontSize={13}
          padding="none"
          label="Privacy"
          onPress={() => {
            WebBrowser.openBrowserAsync(
              "https://www.northof60labs.com/proteinhabit/privacy",
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default ProfileNavList;
