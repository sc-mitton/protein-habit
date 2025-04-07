import { Box, Button, Icon, Text } from "@components";
import { ArrowLeft } from "geist-native-icons";
import { useNavigation } from "@react-navigation/native";

export const BackButton = () => {
  const navigation = useNavigation();

  return (
    <Button
      fontSize={24}
      lineHeight={24}
      onPress={() => navigation.goBack()}
      icon={
        <Box marginRight="xs">
          <Icon
            icon={ArrowLeft}
            size={20}
            color="primaryText"
            strokeWidth={3}
          />
        </Box>
      }
    >
      <Text variant="header">Add Food</Text>
    </Button>
  );
};
