import { Plus, Minus } from "geist-native-icons";
import { Icon } from "./Icon";
import { Box, Button, Text } from "./base";

interface Props {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  suffix?: string;
}

export const IncrementDecrement = (props: Props) => {
  return (
    <Box>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        backgroundColor="primaryButton"
        borderRadius="m"
        gap="s"
        paddingHorizontal="xs"
        paddingVertical="xs"
      >
        <Button
          padding="xs"
          icon={<Icon icon={Minus} size={16} strokeWidth={2.5} />}
          onPress={props.onDecrement}
        />
        <Text>
          {props.value}
          {props.suffix}
        </Text>
        <Button
          padding="xs"
          icon={<Icon icon={Plus} size={16} strokeWidth={2.5} />}
          onPress={props.onIncrement}
        />
      </Box>
    </Box>
  );
};
