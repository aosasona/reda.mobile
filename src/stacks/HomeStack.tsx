import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useColorMode } from "native-base";
import { useEffect, useRef } from "react";
import HomeHeader from "../components/page/home/HomeHeader";
import { navigationConfig } from "../config/screens";
import screens from "../constants/screens";
import { parseNotification } from "../lib/notification";
import Category from "../screens/Category";
import EditDetails from "../screens/docs/EditDetails";
import Preview from "../screens/docs/Preview";
import Read from "../screens/docs/Read";
import Home from "../screens/Home";
import Search from "../screens/Search";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
	const { colorMode } = useColorMode();

	const navigation = useNavigation();
	const responseListener = useRef<any>();

	useEffect(() => {
		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				parseNotification(navigation, response.notification);
			});

		return () => {
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

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
				name={screens.SEARCH.screenName}
				component={Search}
				options={{
					headerTitle: screens.SEARCH.screenTitle,
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name={screens.PREVIEW.screenName}
				component={Preview}
				options={{
					headerShown: true,
					headerTitle: "",
					headerTintColor: "white",
					headerTransparent: true,
					headerStyle: {
						backgroundColor: "transparent",
					},
				}}
			/>
			<Stack.Screen
				name={screens.READ_DOCUMENT.screenName}
				component={Read}
				options={({ route }) => ({
					title:
						(route?.params as any)?.data?.title ||
						screens.READ_DOCUMENT.screenTitle,
					headerShown: true,
					headerShadowVisible: false,
				})}
			/>
			<Stack.Screen
				name={screens.CATEGORY.screenName}
				component={Category}
				options={{
					headerTitle: screens.CATEGORY.screenTitle,
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name={screens.EDIT_DETAILS.screenName}
				component={EditDetails}
				options={{
					headerTitle: screens.EDIT_DETAILS.screenTitle,
					headerShown: true,
				}}
			/>
		</Stack.Navigator>
	);
}
