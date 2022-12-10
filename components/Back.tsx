import {Entypo, MaterialIcons} from "@expo/vector-icons";
import {NavigationProp} from "@react-navigation/native";
import {Button, Icon, useColorModeValue} from "native-base";

interface BackProps {
	page?: string;
	navigation: NavigationProp<any>;
}

export default function Back({ page, navigation }: BackProps) {

  return (
	<Button
	  _text={{ color: "muted.100", fontSize: 18, fontWeight: "regular" }}
	  _pressed={{ opacity: 0.5 }}
	  variant="ghost"
	  onPress={() => navigation.goBack()}
	  startIcon={<Icon as={Entypo} name="chevron-left" size="lg" color="muted.100" />}
	  px={0}
	>
		{page || "Back"}
	</Button>
  );
}