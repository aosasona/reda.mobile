import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {useColorMode} from "native-base";
import {navigationConfig} from "../config/screens";
import screens from "../constants/screens";
import Home from "../screens/Home";
import ReadDocument from "../screens/ReadDocument";

const Stack = createNativeStackNavigator();

export default function HomeStack() {

	const {colorMode} = useColorMode();

	return (
	  <Stack.Navigator {...navigationConfig(colorMode)}>
		  <Stack.Screen name={screens.HOME.screenName} component={Home} options={{
			  headerTitle: screens.HOME.screenTitle,
			  headerShown: false,
		  }}/>
		  <Stack.Screen name={screens.READ_DOCUMENT.screenName} component={ReadDocument} options={{
			  headerTitle: screens.READ_DOCUMENT.screenTitle,
			  headerShown: false,
		  }}/>
	  </Stack.Navigator>
	)
}