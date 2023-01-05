import { Platform } from "expo-modules-core";
import { ColorMode } from "native-base";
import { getPrimaryColor, getSecondaryColor } from "../utils/color.util";
import { colors } from "./theme";

const isAndroid = Platform.OS === "android";

export const iconOptions = (colorMode: ColorMode, focused: boolean) => {
  return focused
    ? getSecondaryColor(colorMode)
    : colorMode == "dark"
      ? colors.brand["faded-dark"]
      : colors.brand.faded;
};

export const screenOptions = (colorMode: ColorMode) => ({
  tabBarHideOnKeyboard: true,
  tabBarActiveTintColor: getSecondaryColor(colorMode),
  tabBarInactiveTintColor:
    colorMode == "dark" ? colors.brand["faded-dark"] : colors.brand.faded,
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
    height: isAndroid ? 65 : 85,
    backgroundColor: getPrimaryColor(colorMode),
    borderTopWidth: 0,
    paddingVertical: 5,
  },
});

const tabConfig = {
  screenOptions,
};

export default tabConfig;
