import { HStack } from "native-base";
import { ReactNode } from "react";
import { HStackProps } from "../../../constants/props";

interface Props {
	children: ReactNode;
}

export default function StaticSettings(
	{ children }: Props = { children: null }
) {
	return <HStack {...HStackProps}>{children}</HStack>;
}
