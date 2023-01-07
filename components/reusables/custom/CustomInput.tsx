import { Box, Input } from "native-base";

interface CustomInputProps {
  name: string;
  type: "text" | "password";
}

export default function CustomInput({ name, type }: CustomInputProps) {
  return (
    <Box>
      <Input
        w="full"
        type={type || "text"}
        _dark={{ bg: "muted.800" }}
        _light={{ bg: "muted.50" }}
      />
    </Box>
  );
}
