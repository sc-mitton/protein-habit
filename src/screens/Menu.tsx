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
              name: "paintbrush",
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
  );
}

export default Menu;
