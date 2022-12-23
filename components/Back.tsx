import {Entypo} from "@expo/vector-icons";
import {NavigationProp} from "@react-navigation/native";
import {Button, Icon, useColorModeValue} from "native-base";

interface BackProps {
	page?: string;
	navigation: NavigationProp<any>;
}

export default function Back({page, navigation}: BackProps) {

	const textColor = useColorModeValue("muted.900", "muted.100");

	return (
	  <Button
		_text={{color: textColor, fontSize: 18, fontWeight: "medium"}}
		_pressed={{opacity: 0.5}}
		variant="ghost"
		onPress={() => navigation.goBack()}
		startIcon={<Icon as={Entypo} name="chevron-left" size="lg" color={textColor}/>}
		px={0}
	  >
		  {page || "Back"}
	  </Button>
	);
}