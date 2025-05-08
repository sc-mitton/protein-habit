import { View, Platform } from "react-native";
import { Menu as PaperMenu } from "react-native-paper";
import * as ZMenu from "zeego/context-menu";
import { useTheme } from "@shopify/restyle";
import { useState } from "react";

import { useAppDispatch } from "@store/hooks";
import { removeTag } from "@store/slices/foodsSlice";
import { Button } from "@components";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const TagMenu = ({
  tagId,
  children,
}: {
  tagId: string;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <View>
      {Platform.OS === "ios" ? (
        // @ts-ignore
        <ZMenu.Root style={{ borderRadius: 12 }}>
          <ZMenu.Trigger
            style={{
              borderRadius: 12,
            }}
          >
            {children}
          </ZMenu.Trigger>
          <ZMenu.Content>
            <ZMenu.Item
              key="delete-tag"
              onSelect={() => dispatch(removeTag(tagId))}
              destructive={true}
            >
              <ZMenu.ItemTitle>Delete Tag</ZMenu.ItemTitle>
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
            title="Delete Tag"
            leadingIcon={() => (
              <FontAwesome6
                name="trash-alt"
                size={24}
                color={theme.colors.error}
              />
            )}
            onPress={() => {
              dispatch(removeTag(tagId));
              setIsOpen(false);
            }}
          />
        </PaperMenu>
      )}
    </View>
  );
};
