import {Box} from "native-base";
import {useEffect} from "react";
import CustomSafeAreaView from "../../components/custom/CustomSafeAreaView";
import {ScreenProps} from "../../types/general";
import {showToast} from "../../utils/notification.util";

export default function EditDetails({navigation}: ScreenProps) {
	useEffect(() => {
		showToast("Title", "message");
	}, []);

	return (
	  <CustomSafeAreaView>
		  <Box></Box>
		  <Box></Box>
	  </CustomSafeAreaView>
	);
}