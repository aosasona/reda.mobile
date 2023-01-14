import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useColorMode} from "native-base";
import {navigationConfig} from "../config/screens";
import screens from "../constants/screens";
import Import from "../screens/Import";

const Stack = createNativeStackNavigator();

export default function ImportStack() {
	const {colorMode} = useColorMode();
	return (
	  <Stack.Navigator {...navigationConfig(colorMode)}>
		  <Stack.Screen
			name={screens.IMPORT.screenName}
			component={Import}
			options={{
				headerTitle: screens.IMPORT.screenTitle,
				headerShown: false,
			}}
		  />
	  </Stack.Navigator>
	);
}