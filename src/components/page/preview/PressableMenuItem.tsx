import { Feather } from "@expo/vector-icons";
import { HStack, Icon, Menu, Text, useColorModeValue } from "native-base";
import { ReactNode } from "react";

interface PressableMenuItemProps {
	icon: {
		as?: any;
		name: string;
		size?: number;
	};
	children: ReactNode;
	color?: string;
	onPress: () => void;
}

export default function PressableMenuItem({
	children,
	color,
	icon: { as, name, size },
	onPress,
}: PressableMenuItemProps) {
	const defaultColor = useColorModeValue("muted.900", "muted.100");

	return (
		<Menu.Item w="full" onPress={onPress} py={3}>
			<HStack alignItems="center" space={2}>
				<Icon
					as={as || Feather}
					name={name}
					size={size || 4}
					color={color || defaultColor}
				/>
				<Text color={color || defaultColor}>{children}</Text>
			</HStack>
		</Menu.Item>
	);
}
