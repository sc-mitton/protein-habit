const getBundleId = () => {
  if (process.env.APP_VARIANT === "production") {
    return "com.northof60labs.proteincount";
  }
  return "com.northof60labs.proteincount.dev";
};

const getAppName = () => {
  if (process.env.APP_VARIANT === "production") {
    return "Protein Count";
  }
  return "Protein Count Dev";
};

const bundleId = getBundleId();
const appName = getAppName();

export default {
  expo: {
    name: appName,
    slug: "protein-count",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
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
      buildNumber: "27",
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
      runtimeVersion: {
        policy: "appVersion",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.northof60labs.proteincount",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    owner: "northof60labs",
    updates: {
      url: "https://u.expo.dev/aa9446c5-886d-49fb-8ba6-3c96ea6981c4",
    },
    extra: {
      eas: {
        projectId: "aa9446c5-886d-49fb-8ba6-3c96ea6981c4",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    plugins: [
      ["expo-iap"],
      ["./plugins/withAsyncStorageBackup.js"],
      ["./plugins/withAndroidBackup.js"],
    ],
  },
};
