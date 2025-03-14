import { Fragment, useState } from "react";
import { MoreHorizontal } from "geist-native-icons";
import { Platform, TouchableHighlight } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Menu as PaperMenu } from "react-native-paper";
import { useTheme } from "@shopify/restyle";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import Entypo from "@expo/vector-icons/Entypo";

import { Icon, Box, Text } from "@components";
import { HomeStackParamList } from "@types";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

function Menu() {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const theme = useTheme();
  const accent = useAppSelector(selectAccent);
  const [isOpen, setIsOpen] = useState(false);

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
              onSelect={() => navigation.navigate("PersonalInfo")}
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
              onSelect={() => navigation.navigate("Appearance")}
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
                onSelect={() => navigation.navigate("EditDailyGoal")}
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
          <PaperMenu
            anchorPosition="top"
            onDismiss={() => setIsOpen(false)}
            contentStyle={{
              marginTop: 64,
              borderRadius: 12,
              paddingVertical: -8,
              overflow: "hidden",
              backgroundColor: theme.colors.cardBackground,
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
                <Icon icon={MoreHorizontal} size={28} color={"primaryText"} />
              </TouchableHighlight>
            }
            visible={isOpen}
          >
            <PaperMenu.Item
              title="Personal Info"
              leadingIcon={() => (
                <Ionicons
                  name="person-circle-sharp"
                  size={24}
                  color={theme.colors.primaryText}
                />
              )}
              onPress={() => navigation.navigate("PersonalInfo")}
            />
            <PaperMenu.Item
              title="Appearance"
              leadingIcon={() => (
                <Entypo
                  name="brush"
                  size={20}
                  color={theme.colors.primaryText}
                />
              )}
              onPress={() => navigation.navigate("Appearance")}
            />
            <PaperMenu.Item
              title="Edit Daily Goal"
              leadingIcon={() => (
                <Box marginLeft="xs">
                  <Foundation
                    name="flag"
                    size={20}
                    color={theme.colors.primaryText}
                  />
                </Box>
              )}
              onPress={() => navigation.navigate("EditDailyGoal")}
            />
          </PaperMenu>
        </Box>
      )}
    </Fragment>
  );
}

export default Menu;
