import { useState } from "react";
import { ArrowLeft, ChevronDown } from "geist-native-icons";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import dayjs from "dayjs";
import DatePicker from "react-native-date-picker";
import * as Haptics from "expo-haptics";

import { Box, Text, Button, Icon } from "@components";
import { useAppDispatch } from "@store/hooks";
import { addEntry, updateEntry } from "@store/slices/proteinSlice";
import type { RootScreenProps } from "@types";
import { dayFormat } from "@constants/formats";
import DescriptionInput from "./DescriptionInput";
import KeyPad from "./KeyPad";
import Value from "./Value";

const Entry = (props: RootScreenProps<"EntryModal">) => {
  const [value, setValue] = useState(props.route.params?.entry?.grams || 0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [day, setDay] = useState(dayjs().format(dayFormat));
  const [name, setName] = useState<string>(
    props.route.params?.entry?.name || "",
  );
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const dispatch = useAppDispatch();

  const handleKeyPress = (key: number | string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (typeof key === "string") {
      setValue((prev) => Math.floor(prev / 10));
      return;
    }
    setValue((prev) => prev * 10 + key);
  };

  const handleSubmit = () => {
    setShowSuccess(true);

    setTimeout(() => {
      if (props.route.params?.entry) {
        dispatch(
          updateEntry({
            ...props.route.params.entry,
            grams: Number(value),
            name: name?.trim(),
          }),
        );
      } else {
        dispatch(
          addEntry({
            name: name?.trim(),
            grams: Number(value),
            day,
          }),
        );
      }
      props.navigation.goBack();
    }, 900);
  };

  return (
    <Box
      flex={1}
      backgroundColor="secondaryBackground"
      marginTop={Platform.select({
        ios: "none",
        android: "l",
      })}
    >
      {Platform.OS === "ios" && (
        <StatusBar
          style={"light"}
          backgroundColor={"transparent"}
          translucent
        />
      )}
      <Box
        paddingTop={Platform.OS === "android" ? "none" : "m"}
        borderRadius="m"
        width="100%"
        backgroundColor="mainBackground"
        borderBottomColor="borderColor"
        borderBottomWidth={1}
      >
        <Box width="100%" alignItems="flex-start" marginBottom="m">
          {Platform.OS === "android" && (
            <Button
              marginTop="xl"
              marginLeft="sm"
              onPress={() => props.navigation.goBack()}
              fontSize={18}
              gap="s"
              icon={
                <Icon
                  icon={ArrowLeft}
                  size={24}
                  strokeWidth={2.5}
                  color="primaryText"
                />
              }
            >
              <Text variant="header" paddingLeft="xs">
                My Foods
              </Text>
            </Button>
          )}
          {Platform.OS === "ios" && (
            <Box marginLeft="ml" marginBottom="xxs">
              <Text variant="header" paddingLeft="xs">
                {props.route.params?.entry ? "Update" : "Add Protein"}
              </Text>
            </Box>
          )}
          <Button
            label={
              dayjs(day).isSame(dayjs(), "day")
                ? "Today"
                : dayjs(day).format("ddd, MMM DD, YYYY")
            }
            textColor="secondaryText"
            marginLeft="m"
            gap="xs"
            marginTop="nxs"
            labelPlacement="left"
            alignItems="center"
            icon={
              <Box marginTop={"xs"}>
                <Icon
                  icon={ChevronDown}
                  size={16}
                  strokeWidth={2.5}
                  color="secondaryText"
                />
              </Box>
            }
            onPress={() => setOpenDatePicker(true)}
          />
          <DatePicker
            modal
            mode="date"
            maximumDate={dayjs().toDate()}
            open={openDatePicker}
            date={dayjs(day).toDate()}
            onConfirm={(date) => {
              setDay(dayjs(date).format(dayFormat));
              setOpenDatePicker(false);
            }}
            onCancel={() => setOpenDatePicker(false)}
          />
        </Box>
        <Value value={value} showSuccess={showSuccess} />
        <DescriptionInput value={name} onChange={setName} />
      </Box>
      <Box flex={1} justifyContent="center">
        <KeyPad
          handleKeyPress={handleKeyPress}
          disabled={value.toString().length >= 3}
        />
        <Box flex={1}>
          <Button
            marginHorizontal="l"
            variant="primary"
            textColor="selected"
            onPress={handleSubmit}
          >
            <Text color="primaryText" accent>
              {`${props.route.params?.entry ? "Update" : "Save"}`}
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Entry;
