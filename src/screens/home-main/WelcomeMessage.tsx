import { Platform } from "react-native";
import dayjs from "dayjs";

import { Box, Text } from "@components";
import { useAppSelector } from "@store/hooks";
import { selectUserInfo } from "@store/slices/userSlice";

const WelcomeMessage = () => {
  const { name } = useAppSelector(selectUserInfo);

  return (
    <Box
      marginLeft="m"
      marginTop={Platform.OS === "ios" ? "statusBar" : "none"}
      paddingTop={Platform.OS === "ios" ? "statusBar" : "l"}
      paddingHorizontal="s"
      alignItems="flex-start"
    >
      <Text variant="bold">Welcome, {name}</Text>
      <Text color="tertiaryText">{dayjs().format("MMM D, YYYY")}</Text>
    </Box>
  );
};

export default WelcomeMessage;
