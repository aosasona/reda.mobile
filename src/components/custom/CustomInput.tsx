import { Box, Input, Text, useColorModeValue } from "native-base";
import { useState } from "react";
import { KeyboardTypeOptions } from "react-native";
import { InputProps } from "../../config/props";
import { isAndroid } from "../../constants/core";

interface CustomInputProps {
	name: string;
	type: "text" | "password";
	keyboardType?: KeyboardTypeOptions;
	value: string;
	onChange: (value: any) => void;
}

export default function CustomInput({
	name,
	value,
	type,
	keyboardType,
	onChange,
}: CustomInputProps) {
	const [isFocused, setIsFocused] = useState(false);
	const textColor = useColorModeValue("light.400", "light.800");

	const toggleFocus = () => setIsFocused(!isFocused);

	return (
		<Box
			_dark={{ bg: "dark.700" }}
			_light={{ bg: "muted.200" }}
			m={0}
			px={3}
			py={2}
			rounded={10}
			borderWidth={isFocused ? 1 : 0}
			borderColor="primary"
		>
			{!isFocused && <Text color={textColor}>{name}</Text>}
			<Input
				{...InputProps}
				w="full"
				value={value}
				type={type || "text"}
				keyboardType={keyboardType || "default"}
				fontSize={16}
				px={0}
				py={isAndroid ? 0.5 : 2}
				onFocus={toggleFocus}
				onBlur={toggleFocus}
				onChangeText={onChange}
			/>
		</Box>
	);
}
