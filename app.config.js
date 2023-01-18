const IS_IN_DEVELOPMENT = process.env.APP_ENVIRONMENT === "development";

export default {
	name: IS_IN_DEVELOPMENT ? "Reda Dev" : "Reda App",
	slug: "reda",
	version: "0.1.76",
	orientation: "portrait",
	icon: "./assets/" + (IS_IN_DEVELOPMENT ? "icon-dev.png" : "icon.png"),
	userInterfaceStyle: "automatic",
	jsEngine: "hermes",
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
		associatedDomains: ["applinks:reda.app", "applinks:www.reda.app"],
		usesIcloudStorage: true,
		usesAppleSignIn: true,
		supportsTablet: false,
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
		useNextNotificationsApi: true,
		allowBackup: true,
	},
	web: {
		favicon: "./assets/favicon.png",
	},
	notification: {
		icon: "./assets/96x96.png",
		color: "#000000",
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
		["expo-notifications"],
		"@config-plugins/react-native-blob-util",
		"@config-plugins/react-native-pdf",
		["./src/plugins/withUISupportsDocumentBrowser"],
	],
};
