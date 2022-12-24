import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorMode } from "native-base";
import HomeHeader from "../components/HomeHeader";
import { navigationConfig } from "../config/screens";
import screens from "../constants/screens";
import Home from "../screens/Home";
import Preview from "../screens/Preview";
import ReadDocument from "../screens/ReadDocument";
import Search from "../screens/Search";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
	const { colorMode } = useColorMode();

	return (
		<Stack.Navigator {...navigationConfig(colorMode)}>
			<Stack.Screen
				name={screens.HOME.screenName}
				component={Home}
				options={{
					headerTitle: screens.HOME.screenTitle,
					headerShown: true,
					header: (props) => <HomeHeader {...props} />,
				}}
			/>
			<Stack.Screen
				name={screens.PREVIEW.screenName}
				component={Preview}
				options={{
					headerTitle: screens.PREVIEW.screenTitle,
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name={screens.SEARCH.screenName}
				component={Search}
				options={{
					title: screens.SEARCH.screenTitle,
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name={screens.READ_DOCUMENT.screenName}
				component={ReadDocument}
				options={({ route }) => ({
					title:
						(route?.params as any)?.data?.title ||
						screens.READ_DOCUMENT.screenTitle,
					headerShown: true,
				})}
			/>
		</Stack.Navigator>
	);
}
