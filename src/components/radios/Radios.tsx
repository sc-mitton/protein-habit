import { useId, useState } from "react";
import { View } from "react-native";

import styles from "./styles";
import { Button } from "../base/Button";
import { Box } from "../restyle";
import type { RadiosProps, Option } from "./types";

export function Radios<T extends Option>(props: RadiosProps<T>) {
  const [value, setValue] = useState(props.defaultValue);
  const id = useId();

  return (
    <View
      style={[
        styles.radios,
        props.horizontal ? styles.horizontalRadios : undefined,
      ]}
    >
      {props.options.map((radio, i) => (
        <Box
          key={`radio-${id}-${i}`}
          marginTop="none"
          borderRadius="m"
          backgroundColor={
            props.cardStyle
              ? value === radio.value
                ? "radioCardSelected"
                : "radioCardUnselected"
              : "transparent"
          }
          style={[styles.radio, props.cardStyle ? styles.cardRadio : undefined]}
        >
          <Box
            borderColor={
              value === radio.value ? "selectedSecondary" : "tertiaryText"
            }
            style={
              value === radio.value
                ? styles.selectedRadioCircleOuter
                : styles.radioCircleOuter
            }
          >
            <Box
              backgroundColor={
                value === radio.value ? "selected" : "transparent"
              }
              style={
                value === radio.value
                  ? styles.selectedRadioCircleInner
                  : styles.radioCircleInner
              }
            />
          </Box>
          <Button
            onPress={() => {
              setValue(radio.value);
              props.onChange(radio.value);
            }}
            backgroundColor="transparent"
            label={radio.label}
            textColor={value === radio.value ? "primaryText" : "secondaryText"}
          />
        </Box>
      ))}
    </View>
  );
}

export default Radios;
