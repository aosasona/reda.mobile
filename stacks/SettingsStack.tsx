import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {useColorMode} from "native-base";
import {navigationConfig} from "../config/screens";
import screens from "../constants/screens";
import BrowserPage from "../screens/Browser";
import Settings from "../screens/Settings";


const Stack = createNativeStackNavigator();

export default function SettingsStack() {
	const {colorMode} = useColorMode();
	return (
	  <Stack.Navigator {...navigationConfig(colorMode)}>
		  <Stack.Screen name={screens.SETTINGS.screenName} component={Settings} options={{
			  headerTitle: screens.SETTINGS.screenTitle,
			  headerShown: false,
		  }}/>
		  <Stack.Screen
			name={screens.BROWSER.screenName}
			component={BrowserPage}
			options={{headerTitle: "", headerShown: false, presentation: "transparentModal"}}
		  />
	  </Stack.Navigator>
	)
}