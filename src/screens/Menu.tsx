import { useState } from "react";
import { MoreHorizontal } from "geist-native-icons";
import { Platform, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Target } from "geist-native-icons";
import { Button as PaperButton, Menu as PaperMenu } from "react-native-paper";
import { useTheme } from "@shopify/restyle";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Icon, Box, Text } from "@components";
import { HomeStackParamList } from "@types";
import { useNavigation } from "@react-navigation/native";

function Menu() {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      {Platform.OS === "ios" ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger style={{ marginTop: 6 }}>
            <Icon icon={MoreHorizontal} size={24} color={"primaryText"} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              key="menu-1"
              onSelect={() => navigation.navigate("PersonalInfo")}
            >
              <DropdownMenu.ItemTitle>Personal Info</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                ios={{
                  name: "person.circle",
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
                  name: "wand.and.rays",
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
                    name: "target",
                    pointSize: 16,
                    scale: "medium",
                  }}
                />
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : (
        <Box justifyContent="space-between" alignItems="center" gap="s">
          <PaperMenu
            anchorPosition="top"
            onDismiss={() => setIsOpen(false)}
            contentStyle={{
              marginTop: 86,
              marginRight: 18,
              borderRadius: 12,
              backgroundColor: theme.colors.cardBackground,
            }}
            anchor={
              <PaperButton
                onPress={() => setIsOpen(!isOpen)}
                theme={{
                  colors: {
                    primary: theme.colors.primaryText,
                  },
                }}
              >
                <Icon icon={MoreHorizontal} size={24} color={"primaryText"} />
              </PaperButton>
            }
            visible={isOpen}
          >
            <PaperMenu.Item
              title="Personal Info"
              leadingIcon={() => (
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color={theme.colors.primaryText}
                />
              )}
              onPress={() => navigation.navigate("PersonalInfo")}
            />
            <PaperMenu.Item
              title="Appearance"
              leadingIcon={() => (
                <Ionicons
                  name="color-wand-outline"
                  size={24}
                  color={theme.colors.primaryText}
                />
              )}
              onPress={() => navigation.navigate("Appearance")}
            />
            <PaperMenu.Item
              title="Edit Daily Goal"
              leadingIcon={() => (
                <Icon icon={Target} size={24} color="primaryText" />
              )}
              onPress={() => navigation.navigate("EditDailyGoal")}
            />
          </PaperMenu>
        </Box>
      )}
    </View>
  );
}

export default Menu;
