import { Box, VStack } from "native-base";
import { ReactNode } from "react";

interface Props {
	title: string;
	children: ReactNode;
	hideTitle?: boolean;
}

export default function SettingsSection({ title, children, hideTitle }: Props) {
	return (
		<Box py={3} px={2}>
			<VStack>{children}</VStack>
		</Box>
	);
}
