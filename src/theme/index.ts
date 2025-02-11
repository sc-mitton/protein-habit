import { createTheme } from "@shopify/restyle";
import { StatusBar } from "react-native";

const palette = {
  gray50: "hsla(30, 2%, 98%, 1)",
  gray100: "hsla(30, 2%, 95%, 1)",
  gray200: "hsla(30, 2%, 90%, 1)",
  gray250: "hsla(30, 2%, 87%, 1)",
  gray300: "hsla(30, 2%, 83%, 1)",
  gray400: "hsla(30, 2%, 74%, 1)",
  gray500: "hsla(30, 4%, 62%, 1)",
  gray600: "hsla(30, 4%, 46%, 1)",
  gray700: "hsla(30, 4%, 38%, 1)",
  gray800: "hsla(30, 4%, 26%, 1)",
  gray850: "hsla(30, 4%, 18%, 1)",
  gray900: "hsla(30, 4%, 13%, 1)",
  gray1000: "hsla(30, 4%, 5%, 1)",
  gray1100: "hsla(30, 4%, 0%, 1)",
};

// Light theme
const lightTheme = createTheme({
  colors: {
    mainBackground: palette.gray100,
    secondaryBackground: palette.gray100
      .replace(
        /(\d+)%,\s\d\)/,
        (match) => `${Math.max(0, parseInt(match) + 5)}%, 1)`,
      )
      .toString(),
    cardBackground: palette.gray100,
    secondaryCardBackground: palette.gray200,
    primaryText: palette.gray900,
    secondaryText: palette.gray600,
    placeholderText: palette.gray400,
    tertiaryText: palette.gray500,
    quaternaryText: palette.gray300,
    borderColor: palette.gray200,
    borderColorBold: palette.gray400,
    transparent: "transparent",
    error: "hsla(0, 84%, 60%, 1)",
    errorSecondary: "hsla(0, 84%, 60%, 0.5)",
    selected: "hsla(210, 100%, 50%, 1)",
    selectedSecondary: "hsla(210, 100%, 50%, .5)",
    success: "rgb(17, 155, 81)",
    unselected: "transparent",
    seperator: palette.gray200,
    overlay: "rgba(0, 0, 0, 0.5)",
    radioCardSelected: palette.gray700,
    radioCardUnselected: palette.gray800,
    defaultShadow: palette.gray500,
    primaryButton: palette.gray250,
    modalAndroidStatusBackground: "#858585",
    white: "white",

    // Accent colors
    yellow: "hsl(45, 57.40%, 47.80%)",
    green: "hsl(163, 75.00%, 28.20%)",
    blue: "hsl(228, 76.30%, 65.30%)",
    purple: "hsl(276, 63.90%, 64.10%)",
    pink: "hsl(330, 60.70%, 64.10%)",
    red: "hsl(358, 50.00%, 50.00%)",
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
  },
  boxVariants: {
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
  shadowVariants: {
    screenSection: {
      shadowColor: "seperator",
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.7,
      shadowRadius: 1,
      elevation: 12,
    },
    secondaryScreenSection: {
      shadowColor: "borderColor",
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.7,
      shadowRadius: 1,
      elevation: 12,
    },
    defaults: {},
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
    body: {
      fontFamily: "Inter-Regular",
      fontSize: 16,
      lineHeight: 24,
      color: "primaryText",
    },
    label: {
      fontFamily: "Inter-Medium",
      fontSize: 14,
      lineHeight: 20,
      color: "secondaryText",
      marginBottom: "s",
    },
    defaults: {
      fontFamily: "Inter-Regular",
      fontSize: 16,
      lineHeight: 20,
      color: "primaryText",
    },
    light: {
      fontFamily: "Inter-Light",
    },
    medium: {
      fontFamily: "Inter-Medium",
    },
    bold: {
      fontFamily: "Inter-Bold",
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
    mainBackground: palette.gray900,
    secondaryBackground: palette.gray900
      .replace(
        /(\d+)%,\s\d\)/,
        (match) => `${Math.max(0, parseInt(match) - 2)}%, 1)`,
      )
      .toString(),
    cardBackground: palette.gray850,
    secondaryCardBackground: palette.gray700,
    primaryText: palette.gray50,
    secondaryText: palette.gray400,
    tertiaryText: palette.gray600,
    placeholderText: palette.gray800,
    quaternaryText: palette.gray800,
    borderColor: palette.gray850,
    borderColorBold: palette.gray700,
    seperator: palette.gray850,
    overlay: "rgba(0, 0, 0, 0.9)",
    radioCardSelected: palette.gray200,
    radioCardUnselected: palette.gray100,
    defaultShadow: palette.gray1000,
    primaryButton: palette.gray850,
    modalAndroidStatusBackground: palette.gray1100,
  },
};

export type Theme = typeof lightTheme;
export default lightTheme;

// ReStyle type augmentation
declare module "@shopify/restyle" {
  type ThemeType = Theme;
}
