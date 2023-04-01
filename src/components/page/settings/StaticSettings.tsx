import { HStack } from "native-base";
import { ReactNode } from "react";
import { HStackProps } from "../../../config/props";

interface Props {
	children: ReactNode;
}

export default function StaticSettings({ children }: Props = { children: null }) {
	return (
		<HStack {...HStackProps} py={3}>
			{children}
		</HStack>
	);
}
