import { View } from "react-native";

import styles from "./styles/header";
import { Text, Button, Box } from "../../base";

const Header = (props: {
  title?: string;
  onClose?: () => void;
  onRemove?: () => void;
}) => {
  return (
    <View style={styles.headerContainer}>
      <Box
        flexDirection="row"
        alignItems="center"
        paddingVertical="s"
        paddingHorizontal="m"
        justifyContent="space-between"
      >
        <Button label="Remove" textColor="selected" onPress={props.onRemove} />
        <Text variant="subheader">{props.title}</Text>
        <Button label="Close" textColor="selected" onPress={props.onClose} />
      </Box>
      <Box borderBottomWidth={1} borderBottomColor="seperator" />
    </View>
  );
};
export default Header;
