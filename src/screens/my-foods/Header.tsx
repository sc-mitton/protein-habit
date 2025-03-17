import { useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Plus, Search, Tag as TagIcon } from "geist-native-icons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import DatePicker from "react-native-date-picker";
import dayjs from "dayjs";
import { Appearance, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";

import { Button, Icon, Box, Text, TextInput, Tag } from "@components";
import { dayFormat } from "@constants/formats";
import { HomeStackParamList } from "@types";
import { useMyFoods } from "./context";
import { useAppSelector } from "@store/hooks";
import { selectTags } from "@store/slices/foodsSlice";

const styles = StyleSheet.create({
  searchInput: {
    paddingLeft: 20,
    marginVertical: -8,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 9,
  },
  inputContainer: {
    zIndex: 1,
    marginHorizontal: 16,
  },
  tagsContainer: {
    marginLeft: -16,
  },
  tagsScroll: {
    gap: 8,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: "center",
  },
});

const Actions = () => {
  const {
    selectedFoods,
    day,
    setDay,
    searchString,
    selectedTags,
    setSearchString,
    setSelectedTags,
  } = useMyFoods();
  const tags = useAppSelector(selectTags);
  const [showTags, setShowTags] = useState(false);
  const [focusedSearch, setFocusedSearch] = useState(false);
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const theme = useTheme();

  return (
    <Box marginBottom="s">
      <Box justifyContent="center" alignItems="center" marginTop="sm">
        <Box
          width={44}
          height={5}
          backgroundColor="quaternaryText"
          borderRadius="full"
          marginBottom="s"
        />
      </Box>
      {!focusedSearch && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            padding="m"
            paddingBottom="none"
          >
            <Text variant="header" paddingLeft="xs">
              {navigation.getState().routes[1].params
                ? "Update"
                : selectedFoods.length > 0
                  ? "Add Protein"
                  : "My Foods"}
            </Text>
            <Box flexDirection="row" gap="s">
              {tags.length > 0 && (
                <Button
                  borderRadius="m"
                  borderWidth={1.5}
                  borderColor="borderColor"
                  onPress={() => setShowTags(!showTags)}
                  icon={
                    <Icon
                      icon={showTags ? Search : TagIcon}
                      size={18}
                      strokeWidth={2.5}
                      color="primaryText"
                    />
                  }
                />
              )}
              {selectedFoods.length <= 0 && (
                <Button
                  borderRadius="m"
                  borderWidth={1.5}
                  borderColor="borderColor"
                  padding="s"
                  fontSize={15}
                  onPress={() => {
                    navigation.navigate("AddFood");
                  }}
                  textColor="primaryText"
                  icon={
                    <Icon
                      icon={Plus}
                      size={18}
                      strokeWidth={2.5}
                      color="primaryText"
                    />
                  }
                />
              )}
            </Box>
            <DatePicker
              modal
              mode="date"
              maximumDate={dayjs().toDate()}
              date={dayjs(day).toDate()}
              onConfirm={(date) => setDay(dayjs(date).format(dayFormat))}
            />
          </Box>
        </Animated.View>
      )}
      <Animated.View
        layout={LinearTransition.springify()
          .mass(0.5)
          .damping(15)
          .stiffness(100)}
        style={styles.inputContainer}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          gap="s"
          marginTop="m"
          width="100%"
        >
          <Box flex={1}>
            {showTags ? (
              <View>
                <Box
                  position="absolute"
                  zIndex={1}
                  width={34}
                  height={40}
                  left={-16}
                >
                  <LinearGradient
                    colors={[
                      Appearance.getColorScheme() === "dark"
                        ? "rgba(30, 30, 30, 0)"
                        : "rgba(255, 255, 255, 0)",
                      theme.colors.modalBackground,
                    ]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                  />
                </Box>
                <ScrollView
                  horizontal
                  style={styles.tagsContainer}
                  contentContainerStyle={styles.tagsScroll}
                  showsHorizontalScrollIndicator={false}
                >
                  {tags.map((tag) => (
                    <Tag
                      key={tag.id}
                      color={tag.color}
                      label={tag.name}
                      onPress={() =>
                        setSelectedTags((prev) => [...prev, tag.id])
                      }
                      selected={selectedTags.includes(tag.id)}
                    />
                  ))}
                </ScrollView>
                <Box
                  position="absolute"
                  zIndex={1}
                  width={34}
                  height={40}
                  right={-16}
                >
                  <LinearGradient
                    colors={[
                      Appearance.getColorScheme() === "dark"
                        ? "rgba(30, 30, 30, 0)"
                        : "rgba(255, 255, 255, 0)",
                      theme.colors.modalBackground,
                    ]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Box>
              </View>
            ) : (
              <TextInput
                value={searchString}
                backgroundColor="primaryButton"
                onChangeText={setSearchString}
                placeholder="Search"
                style={styles.searchInput}
                onFocus={() => setFocusedSearch(true)}
                onBlur={() => setFocusedSearch(false)}
              >
                <Box position="absolute" style={styles.searchIcon}>
                  <Icon
                    icon={Search}
                    size={16}
                    color="secondaryText"
                    strokeWidth={2}
                  />
                </Box>
              </TextInput>
            )}
          </Box>
        </Box>
      </Animated.View>
    </Box>
  );
};

export default Actions;
