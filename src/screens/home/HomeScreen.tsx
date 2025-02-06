import SlotNumbers from "react-native-slot-numbers";
import { Plus } from "geist-native-icons";
import ReAnimated, { LinearTransition } from "react-native-reanimated";
import { useColorScheme } from "react-native";
import { useTheme } from "@shopify/restyle";
import dayjs from "dayjs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import styles from "./styles/home-screen";
import fontStyles from "@styles/fonts";
import { Box, Text, Button, Icon } from "@components";
import { selectTotalProteinForDay } from "@store/slices/proteinSelectors";
import { useAppSelector } from "@store/hooks";
import { RootScreenProps } from "@types";
import { dayFormat } from "@constants/formats";
import { selectFont } from "@store/slices/uiSlice";
import Calendar from "./Calendar";
import Tabs from "./Tabs";

const HomeScreen = (props: RootScreenProps<"Home">) => {
  const theme = useTheme();

  const colorScheme = useColorScheme();
  const font = useAppSelector(selectFont);
  const totalProteinForDay = useAppSelector((state) =>
    selectTotalProteinForDay(state, dayjs().format(dayFormat)),
  );

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box
        padding="m"
        marginTop="s"
        flexDirection="row"
        alignItems="center"
        gap="xl"
        justifyContent="flex-start"
        flex={1.5}
      >
        <Box flexDirection="row" alignItems={"baseline"} gap="s">
          <SlotNumbers
            spring
            animateIntermediateValues
            value={totalProteinForDay}
            fontStyle={[
              styles.bigSlotNumbersStyle,
              { color: theme.colors.primaryText },
              fontStyles[font],
            ]}
          />
          <Text
            variant="bold"
            marginTop="xs"
            marginLeft="ns"
            fontSize={24}
            style={fontStyles[font]}
          >
            g
          </Text>
        </Box>
        <ReAnimated.View layout={LinearTransition}>
          <Box flexDirection="row" gap="sm" paddingRight="m">
            <Button
              borderRadius="full"
              backgroundColor="transparent"
              borderColor="borderColor"
              borderWidth={1}
              padding="sm"
              onPress={() => {
                props.navigation.navigate("Entry");
              }}
              icon={
                <Icon
                  icon={Plus}
                  size={20}
                  color="primaryText"
                  strokeWidth={colorScheme === "dark" ? 1.5 : 2}
                />
              }
            />
            <Button
              borderRadius="full"
              backgroundColor="transparent"
              borderColor="borderColor"
              borderWidth={1}
              padding="sm"
              onPress={() => {
                props.navigation.navigate("MyFoods");
              }}
              icon={
                <MaterialCommunityIcons
                  name="food-drumstick-outline"
                  size={22}
                  color={theme.colors.primaryText}
                />
              }
            />
          </Box>
        </ReAnimated.View>
      </Box>
      <Tabs />
      <Calendar />
    </Box>
  );
};

export default HomeScreen;
