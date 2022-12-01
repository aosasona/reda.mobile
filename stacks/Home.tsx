import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {navigationConfig} from "../config/screens";
import screens from "../constants/screens";
import Home from "../screens/Home";


const Stack = createNativeStackNavigator();

export default function HomeStack() {
	return (
	  <Stack.Navigator {...navigationConfig}>
		  <Stack.Screen name={screens.HOME} component={Home}/>
	  </Stack.Navigator>
	)
}