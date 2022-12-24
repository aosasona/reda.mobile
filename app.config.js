const IS_IN_DEVELOPMENT = process.env.APP_ENVIRONMENT === "development";

export default {
  name: IS_IN_DEVELOPMENT ? "Reda Development" : "Reda Mobile",
  slug: "reda",
  version: "0.1.5",
  orientation: "portrait",
  icon: "./assets/" + (IS_IN_DEVELOPMENT ? "icon-dev.png" : "icon.png"),
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_IN_DEVELOPMENT
      ? "com.wytehq.reda.dev"
      : "com.wytehq.reda",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000",
    },
    package: IS_IN_DEVELOPMENT ? "com.wytehq.reda.dev" : "com.wytehq.reda",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "4e9530b4-d841-4d6f-a817-760b156f95fe",
    },
  },
  plugins: [
    [
      "expo-document-picker",
      {
        iCloudContainerEnvironment: "Production",
      },
    ],
    "@config-plugins/react-native-blob-util",
    "@config-plugins/react-native-pdf",
  ],
};
