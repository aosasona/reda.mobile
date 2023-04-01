import { Box, VStack } from "native-base";
import { ReactNode } from "react";

interface Props {
	title: string;
	children: ReactNode;
	hideTitle?: boolean;
}

export default function SettingsSection({ children }: Props) {
	return (
		<Box py={3} px={1}>
			<VStack>{children}</VStack>
		</Box>
	);
}
