import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabsScreenProps, RecipesStackParamList } from "@types";
import { useTheme } from "@shopify/restyle";
import { Platform } from "react-native";
import ExploreScreen from "./RecipesScreen";
import { selectAccent } from "@store/slices/uiSlice";
import { useAppSelector } from "@store/hooks";
import { Theme } from "@theme";
import { useColorScheme } from "react-native";
import {
  RecipesScreenContextProvider,
  useRecipesScreenContext,
} from "./Context";
import HeaderRight from "./HeaderRight";

const Stack = createNativeStackNavigator<RecipesStackParamList>();

const RecipesStack = (props: BottomTabsScreenProps<"Recipes">) => {
  const theme = useTheme<Theme>();
  const accentColor = useAppSelector(selectAccent);
  const colorScheme = useColorScheme();
  const { selectedFilters, setSearchQuery, searchQuery, setSelectedFilters } =
    useRecipesScreenContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTransparent: true,
        headerBlurEffect: colorScheme === "dark" ? "dark" : "light",
        headerBackTitle: "Back",
        headerTintColor: accentColor
          ? theme.colors[accentColor]
          : theme.colors.primaryText,
        headerLargeTitle: true,
        headerTitleStyle: {
          fontSize: Platform.OS === "ios" ? 18 : 24,
          fontFamily: "Inter-Bold",
          color:
            Object.keys(selectedFilters).length > 0
              ? "transparent"
              : theme.colors.primaryText,
        },
        headerLargeTitleStyle: {
          fontSize: 30,
          fontWeight: "bold",
          fontFamily: "Inter-Bold",
          color: theme.colors.primaryText,
        },
        headerBackTitleStyle: {
          fontSize: 16,
          fontFamily: "Inter-SemiBold",
        },
        ...(Platform.OS === "android" && {
          headerStyle: {
            backgroundColor: theme.colors.matchBlurBackground,
          },
        }),
      }}
    >
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          headerTitleAlign: "left",
          headerSearchBarOptions: {
            onChangeText: (text) => {
              setSelectedFilters({});
              setSearchQuery(text.nativeEvent.text);
            },
            placeholder: "Search",
            hideWhenScrolling: true,
            headerIconColor: theme.colors.primaryText,
            barTintColor: theme.colors.cardBackground,
          },
          headerRight: () => <HeaderRight />,
        }}
      />
    </Stack.Navigator>
  );
};

export default function RecipesStackWrapper(
  props: BottomTabsScreenProps<"Recipes">,
) {
  return (
    <RecipesScreenContextProvider>
      <RecipesStack {...props} />
    </RecipesScreenContextProvider>
  );
}
