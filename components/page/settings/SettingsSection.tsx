import { Box, Text, VStack } from "native-base";
import { ReactNode } from "react";
import CustomDivider from "../../reusables/custom/CustomDivider";

interface Props {
	title: string;
	children: ReactNode;
	hideTitle?: boolean;
}

export default function SettingsSection({ title, children, hideTitle }: Props) {
	return (
		<Box mt={4} mb={2}>
			{!hideTitle && (
				<Text mb={2.5} px={3} opacity={0.4}>
					{title}
				</Text>
			)}
			<VStack
				divider={<CustomDivider />}
				_dark={{ bg: "muted.900", borderColor: "muted.800" }}
				_light={{ bg: "muted.100", borderColor: "muted.200" }}
			>
				{children}
			</VStack>
		</Box>
	);
}
