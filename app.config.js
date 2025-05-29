const getBundleId = () => {
  if (process.env.EXPO_PUBLIC_APP_VARIANT === "production") {
    return "com.northof60labs.proteinhabit";
  }
  return `com.northof60labs.proteinhabit.${process.env.EXPO_PUBLIC_APP_ENV}`;
};

const getAppName = () => {
  if (process.env.EXPO_PUBLIC_APP_VARIANT === "production") {
    return "Protein Habit";
  }
  return `Protein Habit ${process.env.EXPO_PUBLIC_APP_ENV}`;
};

const bundleId = getBundleId();
const appName = getAppName();

export default {
  expo: {
    name: appName,
    slug: "protein-habit",
    scheme: "protein-habit",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    androidStatusBar: {
      translucent: true,
    },
    notification: {
      icon: "./assets/notification-icon.png",
      color: "#4149b0",
    },
    splash: {
      image: "./assets/splash-icon.png",
      contentFit: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: bundleId,
      infoPlist: {
        CFBundleDisplayName: appName,
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      icon: {
        light: "./assets/icon.png",
        dark: "./assets/icon-dark.png",
        tinted: "./assets/icon-tinted.png",
      },
      splash: {
        image: "./assets/splash-ios-light.png",
        contentFit: "contain",
        dark: {
          image: "./assets/splash-ios-dark.png",
          backgroundColor: "#111113",
        },
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      splash: {
        image: "./assets/splash-icon.png",
        contentFit: "contain",
      },
      package: "com.northof60labs.proteinhabit",
      allowBackup: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    owner: "northof60labs",
    updates: {
      url: "https://u.expo.dev/baeb6fad-cd86-4bb9-b233-a9315e60eb68",
    },
    extra: {
      eas: {
        projectId: "baeb6fad-cd86-4bb9-b233-a9315e60eb68",
      },
    },
    runtimeVersion: "1.0.0",
    plugins: [
      [
        "expo-sqlite",
        {
          enableFTS: true,
        },
      ],
      ["./plugins/withNoIpadSupport.js"],
      ["./plugins/withAsyncStorageBackup.js"],
      ["./plugins/withAndroidBackup.js"],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app allows you to pick images from your photo library.",
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission:
            "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
    ],
  },
};
