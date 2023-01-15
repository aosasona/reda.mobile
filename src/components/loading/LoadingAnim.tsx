import Lottie from "lottie-react-native";

const LoadingAnimation = require('../../../assets/animations/loading-bars.json');


export default function LoadingAnim() {
	return (
	  <Lottie source={LoadingAnimation} autoPlay loop/>
	)
}