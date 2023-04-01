import { AspectRatio, Flex } from "native-base";
import LoadingAnim from "./LoadingAnim";

export default function LoadingHeader() {
	return (
		<Flex h={24} alignItems="center" justifyContent="center">
			<AspectRatio w={8} ratio={1}>
				<LoadingAnim />
			</AspectRatio>
		</Flex>
	)
}
