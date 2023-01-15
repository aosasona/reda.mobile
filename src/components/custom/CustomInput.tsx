import { Box, Input, Text, useColorModeValue } from "native-base";
import { KeyboardTypeOptions } from "react-native";

interface CustomInputProps {
  name: string;
  type: "text" | "password";
  keyboardType: KeyboardTypeOptions | undefined;
}

export default function CustomInput({
  name,
  type,
  keyboardType,
}: CustomInputProps) {
  const textColor = useColorModeValue("muted.200", "muted.800");

  return (
    <Box>
      <Text color={textColor}>{name}</Text>
      <Input
        w="full"
        type={type || "text"}
        keyboardType={keyboardType || "default"}
        _dark={{ bg: "muted.800" }}
        _light={{ bg: "muted.50" }}
      />
    </Box>
  );
}
