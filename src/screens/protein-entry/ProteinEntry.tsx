import { useState } from "react";
import { Delete } from "geist-native-icons";
import { StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import SlotNumbers from "react-native-slot-numbers";
import { useTheme } from "@shopify/restyle";

import { Box, Text, Button, Icon } from "@components";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectFont } from "@store/slices/uiSlice";
import { addProteinEntry } from "@store/slices/proteinSlice";
import type { RootScreenProps } from "@types";

const KeypadButton = ({
  value,
  onPress,
}: {
  value: string | number;
  onPress: (value: string | number) => void;
}) => (
  <Button
    backgroundColor="transparent"
    justifyContent="center"
    alignItems="center"
    onPress={() => onPress(value)}
    style={{ flex: 1 }}
  >
    <Text textAlign="center" fontSize={32} lineHeight={32}>
      {value === "del" ? (
        <Icon icon={Delete} size={24} color="primaryText" strokeWidth={2} />
      ) : (
        value
      )}
    </Text>
  </Button>
);

const ProteinEntry = ({ navigation }: RootScreenProps<"ProteinEntry">) => {
  const [value, setValue] = useState(0);
  const font = useAppSelector(selectFont);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleKeyPress = (key: number | string) => {
    if (typeof key === "string") {
      setValue((prev) => Math.floor(prev / 10));
      return;
    }
    setValue((prev) => prev * 10 + key);
  };

  const handleSubmit = () => {
    if (value) {
      dispatch(addProteinEntry(Number(value)));
      navigation.goBack();
    }
  };

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Button
        backgroundColor="secondaryBackground"
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", top: 48, right: 16 }}
      />
      <Box
        padding="l"
        borderRadius="m"
        width="100%"
        marginBottom="xl"
        alignItems="center"
        flexDirection="row"
        justifyContent="center"
        flex={1}
        backgroundColor="secondaryBackground"
        borderBottomColor="borderColor"
        borderBottomWidth={1}
      >
        <Box gap="s">
          <Text variant="header" textAlign="center" color="secondaryText">
            Add Protein
          </Text>
          <Box
            flexDirection="row"
            alignItems="baseline"
            justifyContent="center"
          >
            <SlotNumbers
              value={value}
              easing={"in-out"}
              animationDuration={400}
              animateIntermediateValues={true}
              includeComma={true}
              fontStyle={[
                styles[font],
                { color: theme.colors.primaryText },
                styles.entry,
              ]}
            />
            <Text variant="bold" marginLeft="xs" fontSize={20}>
              g
            </Text>
          </Box>
        </Box>
      </Box>
      <Box width="100%" gap="s" flex={2} padding="l" justifyContent="center">
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          ["", "0", "del"],
        ].map((row, i) => (
          <Box
            key={i}
            flexDirection="row"
            gap="s"
            alignItems="center"
            justifyContent="center"
          >
            {row.map((key) => (
              <KeypadButton
                key={key}
                value={key}
                onPress={() => handleKeyPress(key)}
              />
            ))}
          </Box>
        ))}
      </Box>
      <Button
        margin="l"
        variant="secondary"
        label="Add"
        marginBottom="xxxl"
        onPress={handleSubmit}
        disabled={!value}
      />
    </Box>
  );
};

export default ProteinEntry;

const styles = StyleSheet.create({
  entry: {
    fontSize: 84,
    lineHeight: 84,
  },
  inter: {
    fontFamily: "Inter-Bold",
  },
  nyHeavy: {
    fontFamily: "NewYork-Heavy",
  },
  sfRails: {
    fontFamily: "SFPro-SemiboldRails",
  },
  sfStencil: {
    fontFamily: "SFPro-SemiboldStencil",
  },
});
