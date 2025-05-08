import { Fragment, useState } from "react";
import { MoreHorizontal } from "geist-native-icons";
import { Platform, TouchableHighlight } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import * as DropdownMenu from "zeego/dropdown-menu";
import {
  Menu as MMenu,
  MenuItem as MMenuItem,
} from "react-native-material-menu";
import { useTheme } from "@shopify/restyle";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import Entypo from "@expo/vector-icons/Entypo";

import { Icon, Box, Text } from "@components";
import { BottomTabsParamList } from "@types";
import { useNavigation } from "@react-navigation/native";

function Menu() {
  const navigation = useNavigation<NavigationProp<BottomTabsParamList>>();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <Fragment>
      {Platform.OS === "ios" ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Icon icon={MoreHorizontal} size={26} color={"primaryText"} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              key="menu-1"
              onSelect={() =>
                navigation.navigate("Profile", { screen: "PersonalInfoModal" })
              }
            >
              <DropdownMenu.ItemTitle>Personal Info</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                ios={{
                  name: "person.crop.circle.fill",
                  pointSize: 16,
                  scale: "medium",
                }}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item
              key="menu-2"
              onSelect={() =>
                navigation.navigate("Profile", { screen: "AppearanceModal" })
              }
            >
              <DropdownMenu.ItemTitle>Appearance</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                ios={{
                  name: "paintbrush.pointed.fill",
                  pointSize: 16,
                  scale: "medium",
                }}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Group>
              <DropdownMenu.Item
                key="menu-3"
                onSelect={() =>
                  navigation.navigate("Profile", {
                    screen: "EditDailyGoalModal",
                  })
                }
              >
                <DropdownMenu.ItemTitle>Edit Daily Goal</DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon
                  ios={{
                    name: "flag.fill",
                    pointSize: 16,
                    scale: "medium",
                  }}
                />
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : (
        <Box
          justifyContent="space-between"
          alignItems="center"
          gap="s"
          position="absolute"
          top={0}
          right={0}
        >
          <MMenu
            visible={isOpen}
            style={{
              backgroundColor: theme.colors.secondaryBackground,
              borderRadius: theme.borderRadii.l,
              overflow: "hidden",
            }}
            anchor={
              <TouchableHighlight
                onPress={() => setIsOpen(!isOpen)}
                underlayColor={theme.colors.secondaryBackground}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  marginRight: 2,
                  borderRadius: 24,
                }}
              >
                <Icon
                  icon={MoreHorizontal}
                  size={28}
                  color={"primaryText"}
                  strokeWidth={2}
                />
              </TouchableHighlight>
            }
            onRequestClose={() => setIsOpen(false)}
          >
            <MMenuItem
              onPress={() => {
                navigation.navigate("Profile", {
                  screen: "PersonalInfoModal",
                });
                setIsOpen(false);
              }}
              pressColor={theme.colors.quaternaryText}
            >
              <Box flexDirection="row" alignItems="center">
                <Box width={36} alignItems="flex-start">
                  <Ionicons
                    name="person-circle-sharp"
                    size={24}
                    color={theme.colors.primaryText}
                  />
                </Box>
                <Text>Personal Info</Text>
              </Box>
            </MMenuItem>
            <MMenuItem
              onPress={() => {
                navigation.navigate("Profile", {
                  screen: "AppearanceModal",
                });
                setIsOpen(false);
              }}
              pressColor={theme.colors.quaternaryText}
            >
              <Box flexDirection="row" alignItems="center">
                <Box width={36} alignItems="flex-start">
                  <Entypo
                    name="brush"
                    size={20}
                    color={theme.colors.primaryText}
                  />
                </Box>
                <Text>Appearance</Text>
              </Box>
            </MMenuItem>
            <MMenuItem
              onPress={() => {
                navigation.navigate("Profile", {
                  screen: "EditDailyGoalModal",
                });
                setIsOpen(false);
              }}
              pressColor={theme.colors.quaternaryText}
            >
              <Box flexDirection="row" alignItems="center">
                <Box width={36} alignItems="flex-start">
                  <Foundation
                    name="flag"
                    size={20}
                    color={theme.colors.primaryText}
                  />
                </Box>
                <Text>Edit Daily Goal</Text>
              </Box>
            </MMenuItem>
          </MMenu>
        </Box>
      )}
    </Fragment>
  );
}

export default Menu;
