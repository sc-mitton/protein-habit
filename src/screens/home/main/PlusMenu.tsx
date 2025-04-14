import { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as DropdownMenu from "zeego/dropdown-menu";
import {
  Menu as MMenu,
  MenuItem as MMenuItem,
} from "react-native-material-menu";
import { Plus } from "geist-native-icons";
import { useTheme } from "@shopify/restyle";
import { Search } from "geist-native-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

import { DrumStickIcon } from "@components";
import { Box, Icon, Text } from "@components";
import { RootStackParamList } from "@types";
import { Fragment } from "react";

const PlusMenu = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  return (
    <Fragment>
      {Platform.OS === "ios" ? (
        <Box marginBottom="nm">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger style={{ marginBottom: 10 }}>
              <Box
                backgroundColor="secondaryText"
                borderRadius="full"
                padding="xs"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  icon={Plus}
                  size={16}
                  strokeWidth={3.5}
                  color={"mainBackground"}
                />
              </Box>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                key="menu-1"
                title=""
                onSelect={() => {
                  navigation.navigate("EntryModal");
                }}
              >
                <DropdownMenu.ItemTitle>Manual Entry</DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon
                  ios={{
                    name: "pencil.line",
                    pointSize: 20,
                    scale: "medium",
                  }}
                />
              </DropdownMenu.Item>
              <DropdownMenu.Item
                key="menu-2"
                title="Saved"
                onSelect={() => {
                  navigation.navigate("MyFoodsModal");
                }}
              >
                <DropdownMenu.ItemTitle>Saved Foods</DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon
                  ios={{
                    name: "fork.knife.circle",
                    pointSize: 20,
                    scale: "medium",
                  }}
                />
              </DropdownMenu.Item>
              <DropdownMenu.Item
                key="menu-3"
                title="Search"
                onSelect={() => {
                  navigation.navigate("SearchModal");
                }}
              >
                <DropdownMenu.ItemTitle>Search</DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon
                  ios={{
                    name: "sparkle.magnifyingglass",
                    pointSize: 16,
                    scale: "medium",
                  }}
                />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Box>
      ) : (
        <MMenu
          visible={isOpen}
          style={{
            backgroundColor: theme.colors.secondaryBackground,
            borderRadius: theme.borderRadii.l,
            overflow: "hidden",
          }}
          anchor={
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsOpen(!isOpen);
              }}
            >
              <Box
                backgroundColor="secondaryText"
                borderRadius="full"
                padding="xs"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  icon={Plus}
                  size={20}
                  color={"mainBackground"}
                  strokeWidth={3}
                />
              </Box>
            </TouchableOpacity>
          }
          onRequestClose={() => setIsOpen(false)}
        >
          <MMenuItem
            onPress={() => {
              navigation.navigate("EntryModal");
              setIsOpen(false);
            }}
            pressColor={theme.colors.quaternaryText}
          >
            <Box flexDirection="row" alignItems="center" gap="sm">
              <Box flexDirection="row" alignItems="center" marginRight="xs">
                <Ionicons
                  name="pencil"
                  size={20}
                  color={theme.colors.primaryText}
                />
                <Box
                  position="absolute"
                  left={8}
                  bottom={2}
                  right={2}
                  height={1.5}
                  borderRadius="full"
                  backgroundColor="primaryText"
                />
              </Box>
              <Text>Manual Entry</Text>
            </Box>
          </MMenuItem>
          <MMenuItem
            onPress={() => {
              navigation.navigate("MyFoodsModal");
              setIsOpen(false);
            }}
            pressColor={theme.colors.quaternaryText}
          >
            <Box flexDirection="row" alignItems="center" gap="s">
              <Box flexDirection="row" alignItems="center" marginRight="xs">
                <Icon
                  icon={DrumStickIcon}
                  size={20}
                  borderColor="primaryText"
                />
              </Box>
              <Text>Saved Foods</Text>
            </Box>
          </MMenuItem>
          <MMenuItem
            onPress={() => {
              navigation.navigate("SearchModal");
              setIsOpen(false);
            }}
            pressColor={theme.colors.quaternaryText}
          >
            <Box flexDirection="row" alignItems="center" gap="sm">
              <Box flexDirection="row" alignItems="center" marginRight="xs">
                <Icon icon={Search} size={20} strokeWidth={2.5} />
              </Box>
              <Text>Search</Text>
            </Box>
          </MMenuItem>
        </MMenu>
      )}
    </Fragment>
  );
};

export default PlusMenu;
