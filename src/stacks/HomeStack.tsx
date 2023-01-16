import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorMode } from "native-base";
import { useEffect, useRef } from "react";
import HomeHeader from "../components/page/home/HomeHeader";
import { navigationConfig } from "../config/screens";
import screens from "../constants/screens";
import Category from "../screens/Category";
import EditDetails from "../screens/documents/EditDetails";
import Home from "../screens/Home";
import Preview from "../screens/Preview";
import ReadDocument from "../screens/ReadDocument";
import Search from "../screens/Search";
import * as Notifications from "expo-notifications";
import { parseNotification } from "../utils/notification.util";
import { useNavigation } from "@react-navigation/native";

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
