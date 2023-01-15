import {AntDesign, Entypo, Ionicons} from "@expo/vector-icons";
import {NavigationProp} from "@react-navigation/native";
import {HStack, Icon, IconButton, Menu} from "native-base";
import {useWindowDimensions} from "react-native";
import screens from "../../../constants/screens";
import {CombinedFileResultType} from "../../../types/database";
import {shareFile} from "../../../utils/file.util";
import PressableMenuItem from "./PressableMenuItem";

interface PreviewNavigationHeaderProps {
	data: CombinedFileResultType;
	navigation: NavigationProp<any>;
	functions: {
		handleToggleStar: () => Promise<void>;
		handleToggleReadStatus: () => Promise<void>;
		handleDelete: () => Promise<void>;
	};
}

export function PreviewHeaderRight({
	data,
	navigation,
	functions,
}: PreviewNavigationHeaderProps) {
	const {width} = useWindowDimensions();
	const {handleDelete, handleToggleStar, handleToggleReadStatus} = functions;

	const menuWidth = width * 0.65;

	return (
	  <HStack space={2} alignItems="center">
		  <IconButton
			icon={
				<Icon as={AntDesign} name={data?.is_starred ? "star" : "staro"}/>
			}
			_icon={{
				color: "yellow.400",
				size: 6,
			}}
			_pressed={{
				bg: "transparent",
				_icon: {
					opacity: 0.5,
				},
			}}
			p={2}
			m={0}
			onPress={handleToggleStar}
		  />

		  <Menu
			w={menuWidth < 200 ? 200 : menuWidth}
			py={3}
			trigger={(props) => (
			  <IconButton
				icon={<Icon as={Entypo} name="dots-three-horizontal"/>}
				_icon={{size: 5, color: "white"}}
				_pressed={{bg: "transparent", _icon: {opacity: 0.5}}}
				p={2}
				m={0}
				{...props}
			  />
			)}
		  >
			  <PressableMenuItem
				icon={{as: AntDesign, name: "edit"}}
				onPress={() =>
				  navigation.navigate(screens.EDIT_DETAILS.screenName, {data})
				}
			  >
				  Edit details
			  </PressableMenuItem>
			  <PressableMenuItem
				icon={{
					as: Ionicons,
					name: data?.has_started ? "ios-eye-off-outline" : "ios-eye-outline",
				}}
				onPress={handleToggleReadStatus}
			  >
				  Mark as {data?.has_started ? "unread" : "completed"}
			  </PressableMenuItem>
			  <PressableMenuItem
				icon={{as: Ionicons, name: "ios-share-outline"}}
				onPress={() => shareFile(data?.path)}
			  >
				  Share
			  </PressableMenuItem>
			  <PressableMenuItem
				icon={{name: "trash"}}
				color="red.500"
				onPress={handleDelete}
			  >
				  Delete
			  </PressableMenuItem>
		  </Menu>
	  </HStack>
	);
}