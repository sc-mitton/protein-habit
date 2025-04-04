import { createTheme } from "@shopify/restyle";
import { StatusBar, Platform } from "react-native";
import convert from "color-convert";
import { convertHex2Hsl } from "@utils";

const palette = {
  gray0: "#ffffff",
  gray50: "#fafafa",
  gray100: "#f3f2f2",
  gray150: "#ebebea",
  gray200: "#e6e6e5",
  gray250: "#dfdedd",
  gray300: "#d5d4d3",
  gray400: "#bebdbb",
  gray500: "#a29e9a",
  gray600: "#7a7571",
  gray700: "#65615d",
  gray800: "#454240",
  gray850: "#2d2b2a",
  gray900: "#222120",
  gray1000: "#0d0d0c",
  gray1100: "#000000",
};

// Light theme
const lightTheme = createTheme({
  colors: {
    modalBackground: palette.gray50,
    mainBackground: palette.gray100,
    secondaryBackground: palette.gray50,
    foodItemBackground: palette.gray50,
    cardBackground: palette.gray50,
    secondaryCardBackground: palette.gray200,
    primaryText: palette.gray900,
    secondaryText: palette.gray600,
    placeholderText: palette.gray500,
    tertiaryText: palette.gray500,
    quaternaryText: palette.gray300,
    borderColor: palette.gray200,
    borderColorBold: palette.gray400,
    transparent: "transparent",
    error: "#ef4343",
    errorSecondary: "#ef4343",
    selected: "#007fff",
    selectedSecondary: "#007fff",
    success: "#119b51",
    unselected: "transparent",
    seperator: palette.gray250,
    overlay: "rgba(0, 0, 0, 0.5)",
    radioCardSelected: palette.gray700,
    radioCardUnselected: palette.gray800,
    primaryButton: palette.gray200,
    inputBackground: palette.gray0,
    defaultShadow:
      Platform.OS === "android" ? palette.gray1000 : palette.gray800,
    foodItemShadow:
      Platform.OS === "android" ? palette.gray500 : palette.gray700,
    buttonShadow: palette.gray500,
    modalAndroidStatusBackground: "#858585",
    white: "white",

    // Accent colors
    yellow: "#c09d34",
    yellowText: "#967d29",
    orange: "#d97126",
    orangeText: "#ad5a1e",
    green: "#127e5f",
    greenText: "#0e654c",
    blue: "#637eea",
    blueText: "#4f65bb",
    purple: "#af69de",
    purpleText: "#8c54b2",
    pink: "#db6ca3",
    pinkText: "#af5682",
    red: "#bf4044",
    redText: "#993336",
  },
  spacing: {
    nl: -24,
    nm: -12,
    ns: -8,
    nxs: -4,
    none: 0,
    xxs: 2,
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    ml: 20,
    l: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
    statusBar: StatusBar?.currentHeight ? StatusBar.currentHeight + 24 : 24,
  },
  boxVariants: {
    pillMedium: {
      borderRadius: "full",
      paddingHorizontal: "m",
      paddingVertical: "s",
      fontFamily: "Inter-Regular",
      alignItems: "center",
      justifyContent: "center",
    },
    defaults: {},
  },
  borderRadii: {
    none: 0,
    s: 4,
    sm: 6,
    m: 8,
    l: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  buttonVariants: {
    primary: {
      backgroundColor: "primaryButton",
      alignItems: "center",
      fontSize: 16,
      justifyContent: "center",
      fontFamily: "Inter-Regular",
      color: "primaryText",
      padding: "m",
      borderRadius: "m",
    },
    borderedPrimary: {
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter-Regular",
      color: "primaryText",
      padding: "m",
      borderRadius: "m",
      borderWidth: 1,
      fontSize: 16,
      borderColor: "seperator",
    },
    secondary: {
      backgroundColor: "cardBackground",
      padding: "m",
      borderRadius: "m",
      borderWidth: 1,
      fontSize: 16,
      color: "primaryText",
      borderColor: "borderColor",
      alignItems: "center",
      justifyContent: "center",
    },
    circleButton: {
      backgroundColor: "primaryButton",
      padding: "xs",
      borderRadius: "full",
      fontFamily: "Inter-Regular",
      fontSize: 16,
    },
    pill: {
      borderRadius: "full",
      paddingHorizontal: "xs",
      paddingVertical: "xs",
      fontFamily: "Inter-Regular",
      fontSize: 16,
      lineHeight: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    pillMedium: {
      borderRadius: "full",
      paddingHorizontal: "m",
      paddingVertical: "s",
      fontFamily: "Inter-Regular",
      fontSize: 16,
      lineHeight: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    defaults: {
      backgroundColor: "transparent",
      padding: "s",
      borderRadius: "m",
      fontFamily: "Inter-Regular",
      color: "primaryText",
      fontSize: 16,
    },
  },
  textVariants: {
    header: {
      fontFamily: "Inter-Bold",
      fontSize: 20,
      lineHeight: 26,
      color: "primaryText",
    },
    subtitle: {
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
      lineHeight: 24,
      color: "secondaryText",
    },
    caption: {
      fontFamily: "Inter-Regular",
      fontSize: 13,
      lineHeight: 16,
      color: "secondaryText",
    },
    subheader: {
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
      lineHeight: 24,
      color: "secondaryText",
    },
    miniHeader: {
      fontSize: Platform.OS === "android" ? 16 : 14,
      lineHeight: Platform.OS === "android" ? 23 : 21,
    },
    body: {
      fontFamily: "Inter-Regular",
      fontSize: Platform.OS === "android" ? 18 : 16,
      lineHeight: Platform.OS === "android" ? 24 : 24,
      color: "primaryText",
    },
    label: {
      fontFamily: "Inter-Medium",
      fontSize: 14,
      lineHeight: 20,
      marginLeft: "xs",
      color: "secondaryText",
      marginBottom: "s",
    },
    defaults: {
      fontFamily: "Inter-Regular",
      fontSize: Platform.OS === "android" ? 17 : 16,
      lineHeight: Platform.OS === "android" ? 25 : 24,
      color: "primaryText",
    },
    light: {
      fontFamily: "Inter-Light",
    },
    medium: {
      fontFamily: "Inter-Medium",
    },
    bold: {
      fontFamily: "Inter-SemiBold",
    },
    nyHeavy: {
      fontFamily: "NewYork-Heavy",
    },
    sfRails: {
      fontFamily: "SFPro-SemiboldRails",
    },
    sfRounded: {
      fontFamily: "SFPro-SemiboldRounded",
    },
    sfSoft: {
      fontFamily: "SFPro-SemiboldSoft",
    },
    sfStencil: {
      fontFamily: "SFPro-SemiboldStencil",
    },
  },
});

// Dark theme
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    modalBackground: palette.gray900,
    mainBackground: convertHex2Hsl(palette.gray900)
      .replace(
        /(\d+)%,\s\d\)/,
        (match) => `${Math.max(0, parseInt(match) - 3)}%, 1)`,
      )
      .toString(),
    secondaryBackground: palette.gray900,
    cardBackground: palette.gray850,
    secondaryCardBackground: palette.gray700,
    primaryText: palette.gray50,
    secondaryText: palette.gray500,
    tertiaryText: palette.gray600,
    placeholderText: palette.gray700,
    quaternaryText: palette.gray800,
    borderColor: palette.gray850,
    borderColorBold: palette.gray700,
    seperator: palette.gray850,
    overlay: "rgba(0, 0, 0, 0.9)",
    radioCardSelected: palette.gray200,
    radioCardUnselected: palette.gray100,
    defaultShadow: palette.gray1100,
    foodItemShadow:
      Platform.OS === "android" ? palette.gray1000 : palette.gray1100,
    buttonShadow: palette.gray700,
    primaryButton: palette.gray850,
    inputBackground: palette.gray900,
    foodItemBackground: palette.gray850,
    modalAndroidStatusBackground: palette.gray1100,
  },
};

export type Theme = typeof lightTheme;
export default lightTheme;

// ReStyle type augmentation
declare module "@shopify/restyle" {
  type ThemeType = Theme;
}
