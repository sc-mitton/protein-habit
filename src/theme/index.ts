import { createTheme } from "@shopify/restyle";

const palette = {
  gray50: "hsl(30, 4%, 98%)",
  gray100: "hsl(30, 4%, 96%)",
  gray200: "hsl(30, 4%, 90%)",
  gray300: "hsl(30, 4%, 83%)",
  gray400: "hsl(30, 4%, 74%)",
  gray500: "hsl(30, 4%, 62%)",
  gray600: "hsl(30, 4%, 46%)",
  gray700: "hsl(30, 4%, 38%)",
  gray800: "hsl(30, 4%, 26%)",
  gray850: "hsl(30, 4%, 18%)",
  gray900: "hsl(30, 4%, 13%)",
  gray1000: "hsl(30, 4%, 5%)",
};

// Light theme
const lightTheme = createTheme({
  colors: {
    mainBackground: palette.gray100,
    cardBackground: palette.gray100,
    secondaryCardBackground: palette.gray200,
    primaryText: palette.gray900,
    secondaryText: palette.gray600,
    tertiaryText: palette.gray400,
    borderColor: palette.gray200,
    transparent: "transparent",
    error: "hsl(0, 84%, 60%)",
    selected: "hsl(210, 100%, 50%)",
    unselected: "transparent",
    seperator: palette.gray200,
    overlay: "rgba(0, 0, 0, 0.5)",
  },
  spacing: {
    ns: -4,
    nxs: -2,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
  borderRadii: {
    none: 0,
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  buttonVariants: {
    primary: {
      backgroundColor: "primaryText",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter-SemiBold",
      color: "mainBackground",
      padding: "m",
      borderRadius: "m",
    },
    secondary: {
      backgroundColor: "cardBackground",
      padding: "m",
      borderRadius: "m",
      borderWidth: 1,
      borderColor: "borderColor",
    },
    defaults: {
      backgroundColor: "cardBackground",
      padding: "m",
      borderRadius: "m",
    },
  },
  textVariants: {
    header: {
      fontFamily: "Inter-Bold",
      fontSize: 20,
      lineHeight: 26,
      color: "primaryText",
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
    },
    defaults: {
      fontFamily: "Inter-Regular",
      fontSize: 16,
      lineHeight: 24,
      color: "primaryText",
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
    cardBackground: palette.gray800,
    secondaryCardBackground: palette.gray700,
    primaryText: palette.gray50,
    secondaryText: palette.gray400,
    tertiaryText: palette.gray600,
    borderColor: palette.gray700,
    seperator: palette.gray850,
    overlay: "rgba(0, 0, 0, 0.9)",
  },
};

export type Theme = typeof lightTheme;
export default lightTheme;

// ReStyle type augmentation
declare module "@shopify/restyle" {
  type ThemeType = Theme;
}
