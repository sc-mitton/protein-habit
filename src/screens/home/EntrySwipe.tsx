import { useRef } from "react";
import dayjs from "dayjs";
import { Dimensions } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@shopify/restyle";

import { useAppDispatch } from "@store/hooks";
import { Box } from "@components";
import { Button } from "@components";
import { removeEntry } from "@store/slices/proteinSlice";
import { dayFormat } from "@constants/formats";
import type { ProteinEntry } from "@store/slices/proteinSlice";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const EntrySwipe = ({
  children,
  entry,
}: {
  children: React.ReactNode;
  entry: ProteinEntry;
}) => {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const theme = useTheme();

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={(e) => (
        <Box
          flexDirection="row"
          width={130}
          height="100%"
          marginLeft="m"
          paddingVertical="s"
          gap="s"
        >
          <Button
            backgroundColor="primaryButton"
            borderRadius="m"
            width={60}
            height="100%"
            justifyContent="center"
            alignItems="center"
            onPress={() => {
              swipeableRef.current?.close();
              dispatch(
                removeEntry({
                  day: dayjs().format(dayFormat),
                  id: entry.id,
                }),
              );
            }}
            icon={
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.colors.error}
              />
            }
          />
          <Button
            backgroundColor="primaryButton"
            width={60}
            borderRadius="m"
            height="100%"
            justifyContent="center"
            alignItems="center"
            onPress={() => {
              swipeableRef.current?.close();
              if (entry.food) {
                navigation.navigate("MyFoods", { entry });
              } else {
                navigation.navigate("Entry", { entry });
              }
            }}
            icon={
              <Ionicons
                name="pencil"
                size={24}
                color={theme.colors.primaryText}
              />
            }
          />
        </Box>
      )}
      rightThreshold={SCREEN_WIDTH * 0.4}
    >
      {children}
    </ReanimatedSwipeable>
  );
};

export default EntrySwipe;
