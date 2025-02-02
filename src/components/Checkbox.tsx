import { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Check } from "geist-native-icons";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

import { Box, Text } from "./base";
import { Icon } from "./Icon";
// import { Box } from '../../restyled/Box';
// import { Text } from '../../restyled/Text';
// import { Icon } from '../../restyled/Icon';

export interface CheckboxProps {
  default?: "checked" | "unchecked";
  value?: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  size?: number;
}

export function Checkbox(props: CheckboxProps) {
  const [checked, setChecked] = useState(
    props.default === "checked" ? true : false,
  );
  const { size = 24 } = props;

  useEffect(() => {
    if (props.value !== undefined) setChecked(props.value);
  }, [props.value]);
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => {
        setChecked(!checked);
        props.onChange(!checked);
      }}
    >
      <Box
        backgroundColor={checked ? "selected" : "cardBackground"}
        borderColor={checked ? "transparent" : "borderColor"}
        borderWidth={1.5}
        borderRadius="sm"
        style={{
          width: size,
          height: size,
        }}
      >
        <View style={styles.checkIconContainer} pointerEvents="none">
          {checked && (
            <Animated.View
              style={styles.checkIcon}
              entering={ZoomIn.springify()
                .damping(5)
                .stiffness(200)
                .mass(0.2)
                .overshootClamping(0)}
              exiting={ZoomOut.springify()
                .damping(5)
                .stiffness(200)
                .mass(0.2)
                .overshootClamping(0)}
            >
              <Icon
                icon={Check}
                color="white"
                strokeWidth={3}
                size={size - 7}
              />
            </Animated.View>
          )}
        </View>
      </Box>
      <Text fontSize={15}>{props.label}</Text>
    </TouchableOpacity>
  );
}

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  checkIconContainer: {
    position: "absolute",
    width: 2,
    height: 2,
    top: "50%",
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: {
    transform: [{ translateX: -1 }, { translateY: -0.5 }],
    position: "absolute",
  },
});
