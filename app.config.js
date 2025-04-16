const getBundleId = () => {
  if (process.env.APP_VARIANT === "production") {
    return "com.northof60labs.proteincount";
  }
  return `com.northof60labs.proteincount.${process.env.APP_ENV}`;
};

const getAppName = () => {
  if (process.env.APP_VARIANT === "production") {
    return "Protein Count";
  }
  return `Protein Count ${process.env.APP_ENV}`;
};

const bundleId = getBundleId();
const appName = getAppName();

export default {
  expo: {
    name: appName,
    slug: "protein-count",
    scheme: "protein-count",
    version: "1.0.0",
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
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: bundleId,
      infoPlist: {
        CFBundleDisplayName: appName,
      },
      icon: {
        light: "./assets/icon.png",
        dark: "./assets/icon-dark.png",
        tinted: "./assets/icon-tinted.png",
      },
      splash: {
        image: "./assets/splash-ios-light.png",
        resizeMode: "contain",
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
        resizeMode: "contain",
      },
      package: "com.northof60labs.proteincount",
      allowBackup: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    owner: "northof60labs",
    updates: {
      url: "https://u.expo.dev/6df3f0fe-e7b4-45b7-b721-3139de64dd31",
    },
    extra: {
      eas: {
        projectId: "6df3f0fe-e7b4-45b7-b721-3139de64dd31",
      },
    },
    runtimeVersion: "1.0.0",
    plugins: [
      ["expo-iap"],
      [
        "expo-sqlite",
        {
          enableFTS: true,
        },
      ],
      ["./plugins/withNoIpadSupport.js"],
      ["./plugins/withAsyncStorageBackup.js"],
      ["./plugins/withAndroidBackup.js"],
    ],
  },
};
