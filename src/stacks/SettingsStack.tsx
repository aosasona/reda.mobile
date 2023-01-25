import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useColorMode} from "native-base";
import {navigationConfig} from "../config/screens";
import screens from "../constants/screens";
import BrowserPage from "../screens/Browser";
import Settings from "../screens/settings";
import Appearance from "../screens/settings/Appearance";
import NotificationsPreference from "../screens/settings/NotificationsPreference";
import Security from "../screens/settings/Security";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
	const {colorMode} = useColorMode();
	return (
	  <Stack.Navigator {...navigationConfig(colorMode)}>
		  <Stack.Screen
			name={screens.SETTINGS.screenName}
			component={Settings}
			options={{
				headerTitle: screens.SETTINGS.screenTitle,
				headerShown: false,
			}}
		  />
		  <Stack.Screen
			name={screens.APPEARANCE_SETTINGS.screenName}
			component={Appearance}
			options={{
				headerTitle: screens.APPEARANCE_SETTINGS.screenTitle,
				headerShown: true,
				headerBackTitle: "Settings",
			}}
		  />
		  <Stack.Screen
			name={screens.SECURITY_SETTINGS.screenName}
			component={Security}
			options={{
				headerTitle: screens.SECURITY_SETTINGS.screenTitle,
				headerShown: true,
				headerBackTitle: "Settings",
			}}
		  />
		  <Stack.Screen
			name={screens.NOTIFICATIONS_SETTINGS.screenName}
			component={NotificationsPreference}
			options={{
				headerTitle: screens.NOTIFICATIONS_SETTINGS.screenTitle,
				headerShown: true,
				headerBackTitle: "Settings",
			}}
		  />
		  <Stack.Screen
			name={screens.BROWSER.screenName}
			component={BrowserPage}
			options={{
				headerTitle: screens.BROWSER.screenTitle,
				headerShown: false,
				presentation: "modal",
			}}
		  />
	  </Stack.Navigator>
	);
}