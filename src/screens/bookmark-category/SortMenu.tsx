import { useState } from "react";
import { Platform, StyleSheet, TouchableHighlight } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import {
  Menu as MMenu,
  MenuItem as MMenuItem,
} from "react-native-material-menu";
import { useTheme } from "@shopify/restyle";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Box, Text } from "@components";
import { Theme } from "@theme";
import { useAppSelector } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";

type SortOption = "alphabetical" | "reverse" | "default";

interface SortMenuProps {
  onSortChange: (sortOption: SortOption) => void;
  currentSort: SortOption;
}

const styles = StyleSheet.create({
  trigger: {
    marginRight: -6,
  },
});

function SortMenu({ onSortChange, currentSort }: SortMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme<Theme>();
  const accent = useAppSelector(selectAccent);

  const handleSortChange = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  return (
    <Box>
      {Platform.OS === "ios" ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger style={styles.trigger}>
            <Ionicons
              name="filter-circle-outline"
              size={28}
              color={accent ? theme.colors[accent] : theme.colors.primaryText}
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              key="sort-1"
              onSelect={() => handleSortChange("alphabetical")}
            >
              <DropdownMenu.ItemTitle>Sort a-z</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                ios={{
                  name: "arrow.up",
                  pointSize: 16,
                  scale: "medium",
                }}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item
              key="sort-2"
              onSelect={() => handleSortChange("reverse")}
            >
              <DropdownMenu.ItemTitle>Sort z-a</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                ios={{
                  name: "arrow.down",
                  pointSize: 16,
                  scale: "medium",
                }}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item
              key="sort-3"
              onSelect={() => handleSortChange("default")}
            >
              <DropdownMenu.ItemTitle>Default Order</DropdownMenu.ItemTitle>
              <DropdownMenu.ItemIcon
                ios={{
                  name: "arrow.clockwise",
                  pointSize: 16,
                  scale: "medium",
                }}
              />
            </DropdownMenu.Item>
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
                <MaterialIcons
                  name="sort"
                  size={28}
                  color={theme.colors.primaryText}
                />
              </TouchableHighlight>
            }
            onRequestClose={() => setIsOpen(false)}
          >
            <MMenuItem
              onPress={() => handleSortChange("alphabetical")}
              pressColor={theme.colors.quaternaryText}
            >
              <Box flexDirection="row" alignItems="center">
                <Box width={36} alignItems="flex-start">
                  <Ionicons
                    name="arrow-up"
                    size={24}
                    color={theme.colors.primaryText}
                  />
                </Box>
                <Text>Sort A-Z</Text>
              </Box>
            </MMenuItem>
            <MMenuItem
              onPress={() => handleSortChange("reverse")}
              pressColor={theme.colors.quaternaryText}
            >
              <Box flexDirection="row" alignItems="center">
                <Box width={36} alignItems="flex-start">
                  <Ionicons
                    name="arrow-down"
                    size={24}
                    color={theme.colors.primaryText}
                  />
                </Box>
                <Text>Sort Z-A</Text>
              </Box>
            </MMenuItem>
            <MMenuItem
              onPress={() => handleSortChange("default")}
              pressColor={theme.colors.quaternaryText}
            >
              <Box flexDirection="row" alignItems="center">
                <Box width={36} alignItems="flex-start">
                  <Ionicons
                    name="arrow-undo"
                    size={24}
                    color={theme.colors.primaryText}
                  />
                </Box>
                <Text>Default Order</Text>
              </Box>
            </MMenuItem>
          </MMenu>
        </Box>
      )}
    </Box>
  );
}

export default SortMenu;
