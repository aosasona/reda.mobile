import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useColorMode} from "native-base";
import {navigationConfig} from "../config/screens";
import screens from "../constants/screens";
import Search from "../screens/Search";

const Stack = createNativeStackNavigator();

export default function SearchStack() {
	const {colorMode} = useColorMode();
	return (
	  <Stack.Navigator {...navigationConfig(colorMode)}>
		  <Stack.Screen
			name={screens.SEARCH.screenName}
			component={Search}
			options={{
				headerTitle: screens.SEARCH.screenTitle,
				headerShown: false,
			}}
		  />
	  </Stack.Navigator>
	);
}