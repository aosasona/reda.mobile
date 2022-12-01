import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {navigationConfig} from "../config/screens";
import screens from "../constants/screens";
import Settings from "../screens/Settings";


const Stack = createNativeStackNavigator();

export default function SettingsStack() {
	return (
	  <Stack.Navigator {...navigationConfig}>
		  <Stack.Screen name={screens.SETTINGS} component={Settings}/>
	  </Stack.Navigator>
	)
}