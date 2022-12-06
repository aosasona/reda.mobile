import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {useColorMode} from "native-base";
import {navigationConfig} from "../config/screens";
import screens from "../constants/screens";
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
	  </Stack.Navigator>
	)
}