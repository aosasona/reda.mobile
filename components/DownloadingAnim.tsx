import Lottie from "lottie-react-native";
import {useColorMode} from "native-base";

const DownloadingAnimation = require('../assets/animations/downloading.json');


export default function DownloadingAnim() {
	const {colorMode} = useColorMode();
	const isDark = colorMode === "dark";
	
	return (
	  <Lottie source={DownloadingAnimation} colorFilters={[
		  {
			  keypath: 'Arrow',
			  color: isDark ? "#FAFAFA" : "#101010",
		  },
		  {
			  keypath: 'Outline',
			  color: isDark ? "#FAFAFA" : "#101010",
		  },
		  {
			  keypath: 'Outline 2',
			  color: isDark ? "#FAFAFA20" : "#3A3A3A20",
		  },
	  ]} autoPlay loop/>
	)
}