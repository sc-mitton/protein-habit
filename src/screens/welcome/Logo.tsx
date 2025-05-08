import { Image } from "expo-image";
import { useColorScheme } from "react-native";

import { Box } from "@components";
import logo from "@assets/icon.png";
import logoDark from "@assets/icon-dark.png";

const Logo = () => {
  const scheme = useColorScheme();

  return (
    <Box
      alignItems="center"
      paddingBottom="xl"
      shadowColor="defaultShadow"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.35}
      shadowRadius={3}
      elevation={5}
    >
      {scheme === "dark" ? (
        <Box
          borderColor="borderColor"
          borderWidth={1}
          borderRadius="l"
          overflow="hidden"
        >
          <Image
            source={logoDark}
            style={{ width: 64, height: 64 }}
            contentFit="contain"
          />
        </Box>
      ) : (
        <Box
          borderColor="borderColor"
          borderWidth={1}
          borderRadius="l"
          overflow="hidden"
        >
          <Image
            source={logo}
            style={{ width: 64, height: 64 }}
            contentFit="contain"
          />
        </Box>
      )}
    </Box>
  );
};

export default Logo;
