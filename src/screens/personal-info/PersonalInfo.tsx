import { useState } from "react";
import { Check, X } from "geist-native-icons";

import { Box, Text, TextInput, Button } from "@components";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setName, setWeight, setWeightUnit } from "@store/slices/userSlice";
import { Icon, Radios } from "@components";
import { selectUserInfo } from "@store/slices/userSlice";
import type { RootScreenProps } from "@types";

const PersonalInfo = ({ navigation }: RootScreenProps<"PersonalInfo">) => {
  const user = useAppSelector(selectUserInfo);
  const [newName, setNewName] = useState(user.name);
  const [newWeight, setNewWeight] = useState(user.weight.value.toString());
  const [newUnits, setNewUnits] = useState(user.weight.unit);
  const dispatch = useAppDispatch();

  const handleSave = () => {
    if (newName.trim()) {
      dispatch(setName(newName.trim()));
    }
    if (newWeight) {
      dispatch(setWeight(Number(newWeight)));
    }
    if (newUnits) {
      dispatch(setWeightUnit(newUnits));
    }
    navigation.goBack();
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" padding="l">
      <Box flex={1}>
        <Button
          backgroundColor="transparent"
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", top: -24, right: -24 }}
          icon={<Icon icon={X} size={20} color="primaryText" strokeWidth={2} />}
        />
        <Text variant="header" marginBottom="xl">
          Personal Info
        </Text>
        <Box marginBottom="m">
          <Text variant="label" marginBottom="s">
            Name
          </Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Your name"
          />
        </Box>
        <Box
          flexDirection="row"
          gap="l"
          alignItems="flex-start"
          marginBottom="xl"
        >
          <Box gap="m" flex={1}>
            <Text variant="label">Weight</Text>
            <TextInput
              value={newWeight}
              onChangeText={setNewWeight}
              placeholder="Your weight"
              keyboardType="numeric"
            />
          </Box>
          <Box>
            <Text variant="label" marginBottom="s">
              <Text marginBottom="xs">Units</Text>
            </Text>
            <Radios
              options={
                [
                  { label: "lbs", value: "lbs" },
                  { label: "kg", value: "kg" },
                ] as const
              }
              defaultValue={newUnits}
              onChange={setNewUnits}
            />
          </Box>
        </Box>
        <Button
          variant="primary"
          label="Save Changes"
          onPress={handleSave}
          disabled={!newName.trim() || !newWeight}
          labelPlacement="left"
          icon={
            <Icon
              icon={Check}
              size={20}
              color="mainBackground"
              strokeWidth={3}
            />
          }
        />
      </Box>
    </Box>
  );
};

export default PersonalInfo;
