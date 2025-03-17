import { useState } from "react";
import { View, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Menu as PaperMenu } from "react-native-paper";
import { useTheme } from "@shopify/restyle";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as ZMenu from "zeego/context-menu";

import { Button, Text, Box } from "@components";
import { deactiveFood, type Food } from "@store/slices/foodsSlice";
import { useAppDispatch } from "@store/hooks";

const Menu = ({
  food,
  children,
}: {
  food: Food;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View>
      {Platform.OS === "ios" ? (
        // @ts-ignore
        <ZMenu.Root style={{ borderRadius: 12 }}>
          <ZMenu.Trigger
            style={{
              backgroundColor: theme.colors.foodItemBackground,
              borderRadius: 12,
            }}
          >
            {children}
          </ZMenu.Trigger>
          <ZMenu.Content>
            <ZMenu.Item
              onSelect={() => navigation.navigate("AddFood", { food })}
              key={food.id + "2"}
            >
              <ZMenu.ItemTitle>Edit</ZMenu.ItemTitle>
              <ZMenu.ItemIcon
                ios={{
                  name: "pencil",
                  pointSize: 16,
                  weight: "semibold",
                  scale: "medium",
                }}
              />
            </ZMenu.Item>
            <ZMenu.Separator />
            <ZMenu.Item
              onSelect={() => dispatch(deactiveFood(food.id))}
              key={food.id + "1"}
              destructive={true}
            >
              <ZMenu.ItemTitle>Delete</ZMenu.ItemTitle>
              <ZMenu.ItemIcon
                ios={{
                  name: "trash",
                  pointSize: 16,
                  weight: "semibold",
                  scale: "medium",
                }}
              />
            </ZMenu.Item>
          </ZMenu.Content>
        </ZMenu.Root>
      ) : (
        <PaperMenu
          anchor={
            <Button onPress={() => setIsOpen(!isOpen)}>{children}</Button>
          }
          visible={isOpen}
          onDismiss={() => setIsOpen(false)}
          anchorPosition="top"
          contentStyle={{
            borderRadius: 12,
            transform: [{ translateY: -48 }, { translateX: 4 }],
            backgroundColor: theme.colors.cardBackground,
          }}
        >
          <PaperMenu.Item
            title="Edit"
            leadingIcon={() => <FontAwesome6 name="pencil" size={24} />}
            onPress={() => navigation.navigate("AddFood", { food })}
          />
          <PaperMenu.Item
            title="Delete"
            leadingIcon={() => (
              <FontAwesome6
                name="trash-alt"
                size={24}
                color={theme.colors.error}
              />
            )}
            onPress={() => {
              dispatch(deactiveFood(food.id));
            }}
          />
        </PaperMenu>
      )}
    </View>
  );
};

const FoodItem = ({ food, onPress }: { food: Food; onPress: () => void }) => {
  return (
    <Menu food={food}>
      <Box
        backgroundColor="transparent"
        shadowColor="defaultShadow"
        shadowOpacity={0.1}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={2}
        elevation={5}
        borderRadius="l"
      >
        <Box
          key={food.id}
          backgroundColor={"foodItemBackground"}
          padding={Platform.OS === "ios" ? "s" : "sm"}
          borderRadius="l"
          shadowColor="defaultShadow"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          elevation={5}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            flexDirection="row"
            alignItems="center"
            padding="none"
            gap="s"
            marginRight="s"
            onPress={onPress}
          >
            <Text fontSize={20} lineHeight={28}>
              {food.emoji}
            </Text>
            <Box>
              <Text
                variant="body"
                fontSize={Platform.OS === "ios" ? 14 : 15}
                lineHeight={16}
              >
                {food.name}
              </Text>
              <Text
                variant="body"
                color="secondaryText"
                fontSize={Platform.OS === "ios" ? 13 : 14}
              >
                {food.protein}g
              </Text>
            </Box>
          </Button>
        </Box>
      </Box>
    </Menu>
  );
};

export default FoodItem;
