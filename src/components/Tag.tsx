import { AccentOption } from "@constants/accents";
import { TouchableOpacity, StyleSheet, Appearance } from "react-native";
import { Box } from "./base/Box";

import { Text } from ".";

const styles = StyleSheet.create({
  tag: {
    position: "relative",
  },
});

type Props = {
  color: AccentOption;
  label: string;
  onPress: () => void;
  selected: boolean;
};

export const Tag = (props: Props) => {
  const { color, label, onPress, selected, ...rest } = props;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <Box
        variant="pillMedium"
        style={styles.tag}
        shadowColor="defaultShadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={Appearance.getColorScheme() === "dark" ? 1 : 0}
        shadowRadius={3}
        elevation={5}
      >
        <Box
          borderColor={color}
          opacity={selected ? 0.7 : 0.04}
          position="absolute"
          style={[StyleSheet.absoluteFill]}
          borderRadius="full"
          backgroundColor="transparent"
          borderWidth={1.5}
        />
        <Box
          backgroundColor={color}
          position="absolute"
          style={[StyleSheet.absoluteFill]}
          opacity={0.1}
          justifyContent="center"
          alignItems="center"
          borderRadius="full"
        />
        <Text fontSize={16} lineHeight={18} color={color}>
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default Tag;
