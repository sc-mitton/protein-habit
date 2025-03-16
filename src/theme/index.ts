import { createTheme } from "@shopify/restyle";
import { StatusBar, Platform } from "react-native";

const palette = {
  gray50: "hsla(30, 2%, 98%, 1)",
  gray100: "hsla(30, 2%, 95%, 1)",
  gray150: "hsla(30, 2%, 92%, 1)",
  gray200: "hsla(30, 2%, 90%, 1)",
  gray250: "hsla(30, 2%, 87%, 1)",
  gray300: "hsla(30, 2%, 83%, 1)",
  gray400: "hsla(30, 2%, 74%, 1)",
  gray500: "hsla(30, 4%, 62%, 1)",
  gray600: "hsla(30, 4%, 46%, 1)",
  gray700: "hsla(30, 4%, 38%, 1)",
  gray800: "hsla(30, 4%, 26%, 1)",
  gray850: "hsla(30, 4%, 17%, 1)",
  gray900: "hsla(30, 4%, 13%, 1)",
  gray1000: "hsla(30, 4%, 5%, 1)",
  gray1100: "hsla(30, 4%, 0%, 1)",
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
    error: "hsla(0, 84%, 60%, 1)",
    errorSecondary: "hsla(0, 84%, 60%, 0.5)",
    selected: "hsla(210, 100%, 50%, 1)",
    selectedSecondary: "hsla(210, 100%, 50%, .5)",
    success: "rgb(17, 155, 81)",
    unselected: "transparent",
    seperator: palette.gray250,
    overlay: "rgba(0, 0, 0, 0.5)",
    radioCardSelected: palette.gray700,
    radioCardUnselected: palette.gray800,
    primaryButton: palette.gray200,
    defaultShadow:
      Platform.OS === "android" ? palette.gray1000 : palette.gray800,
    buttonShadow: palette.gray500,
    modalAndroidStatusBackground: "#858585",
    white: "white",

    // Accent colors
    yellow: "#c09d34",
    orange: "#d97126",
    green: "#127e5f",
    blue: "#637eea",
    purple: "#af69de",
    pink: "#db6ca3",
    red: "#bf4044",
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
    mainBackground: palette.gray900
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
    buttonShadow: palette.gray700,
    primaryButton: palette.gray850,
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
