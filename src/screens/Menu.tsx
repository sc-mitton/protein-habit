import { MoreHorizontal } from "geist-native-icons";
import { NavigationProp } from "@react-navigation/native";
import * as DropdownMenu from "zeego/dropdown-menu";

import { Icon } from "@components";
import { RootStackParamList } from "@types";
import { useNavigation } from "@react-navigation/native";

function Menu() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Icon icon={MoreHorizontal} size={24} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          key="24"
          onSelect={() => navigation.navigate("Appearance")}
        >
          <DropdownMenu.ItemTitle>Appearance</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: "paintbrush.pointed.fill",
              pointSize: 16,
              weight: "semibold",
              scale: "medium",
            }}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default Menu;
