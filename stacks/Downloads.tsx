import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {navigationConfig} from "../config/screens";
import screens from "../constants/screens";
import Import from "../screens/Import";


const Stack = createNativeStackNavigator();

export default function DownloadsStack() {
	return (
	  <Stack.Navigator {...navigationConfig}>
		  <Stack.Screen name={screens.DOWNLOADS} component={Import}/>
	  </Stack.Navigator>
	)
}