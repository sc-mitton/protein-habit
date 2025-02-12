import { useState } from "react";
import { View, Platform, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Menu as PaperMenu } from "react-native-paper";
import { useTheme } from "@shopify/restyle";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import * as ZMenu from "zeego/context-menu";
import { Button, Icon, Text, Box } from "@components";
import { deactiveFood, type Food } from "@store/slices/foodsSlice";
import { Plus } from "geist-native-icons";
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
        <View>
          <ZMenu.Root>
            <ZMenu.Trigger>{children}</ZMenu.Trigger>
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
        </View>
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
  const scheme = useColorScheme();

  return (
    <Menu food={food}>
      <Box
        backgroundColor="transparent"
        shadowColor="defaultShadow"
        shadowOpacity={0.2}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={2}
        elevation={5}
      >
        <Box
          key={food.id}
          backgroundColor={
            scheme === "dark" ? "primaryButton" : "mainBackground"
          }
          padding={Platform.OS === "ios" ? "s" : "sm"}
          paddingRight="xxs"
          borderRadius="l"
          shadowColor="defaultShadow"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.2}
          shadowRadius={8}
          elevation={5}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row" alignItems="center" gap="xs" marginRight="s">
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
          </Box>
          <Button
            onPress={onPress}
            icon={
              <Icon
                icon={Plus}
                size={20}
                strokeWidth={2}
                color="tertiaryText"
              />
            }
          />
        </Box>
      </Box>
    </Menu>
  );
};

export default FoodItem;
