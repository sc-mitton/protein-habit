import { useColorScheme } from "react-native";

import * as ContextMenu from "zeego/context-menu";
import { Button, Icon, Text, Box } from "@components";
import { removeFood, type Food } from "@store/slices/foodsSlice";
import { Plus } from "geist-native-icons";
import { useAppDispatch } from "@store/hooks";

const FoodItem = ({ food, onPress }: { food: Food; onPress: () => void }) => {
  const dispatch = useAppDispatch();
  const scheme = useColorScheme();

  return (
    <ContextMenu.Root key={food.id}>
      <ContextMenu.Trigger>
        <Box
          backgroundColor="transparent"
          shadowColor="tipShadow"
          shadowOpacity={0.2}
          shadowOffset={{ width: 0, height: 2 }}
          shadowRadius={2}
          elevation={5}
        >
          <Button
            key={food.id}
            onPress={onPress}
            backgroundColor={
              scheme === "dark" ? "primaryButton" : "mainBackground"
            }
            padding="s"
            paddingRight="s"
            borderRadius="l"
            shadowColor="tipShadow"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.2}
            shadowRadius={8}
            elevation={5}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            labelPlacement="left"
            icon={
              <Icon
                icon={Plus}
                size={20}
                strokeWidth={2}
                color="tertiaryText"
              />
            }
          >
            <Box
              flexDirection="row"
              alignItems="center"
              gap="s"
              marginRight="m"
            >
              <Text>{food.emoji}</Text>
              <Box>
                <Text variant="body" fontSize={14} lineHeight={16}>
                  {food.name}
                </Text>
                <Text variant="body" color="secondaryText" fontSize={13}>
                  {food.protein}g
                </Text>
              </Box>
            </Box>
          </Button>
        </Box>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item
          onSelect={() => dispatch(removeFood)}
          key={food.id}
          destructive={true}
        >
          <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: "trash",
              pointSize: 16,
              weight: "semibold",
              scale: "medium",
            }}
          />
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

export default FoodItem;
