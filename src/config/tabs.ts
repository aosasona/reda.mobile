import {Platform} from "expo-modules-core";
import {ColorMode} from "native-base";
import {getPrimaryColor, getSecondaryColor} from "../lib/color";
import {colors} from "./theme";

const isAndroid = Platform.OS === "android";

export const iconOptions = (colorMode: ColorMode, focused: boolean) => {
	return focused
	  ? getSecondaryColor(colorMode)
	  : colorMode == "dark"
		? colors.dark["600"]
		: colors.light["400"];
};

export const screenOptions = (colorMode: ColorMode) => ({
	tabBarHideOnKeyboard: true,
	tabBarActiveTintColor: getSecondaryColor(colorMode),
	tabBarInactiveTintColor:
	  colorMode == "dark" ? colors.dark["600"] : colors.light["400"],
	headerShown: false,
	headerTintColor: getSecondaryColor(colorMode),
	headerTitleStyle: {
		fontSize: 20,
	},
	headerStyle: {
		backgroundColor: getPrimaryColor(colorMode),
		shadowColor: "transparent",
	},
	tabBarLabelStyle: {
		fontSize: 10,
		display: "none",
	},
	tabBarStyle: {
		height: isAndroid ? 70 : 85,
		backgroundColor: getPrimaryColor(colorMode),
		borderTopWidth: 0,
	},
});

const tabConfig = {
	screenOptions,
};

export default tabConfig;