import { Box, Button, Heading, Input, Text, VStack } from "native-base";
import { ButtonProps, InputProps } from "../../../config/props";
import { ImportHeaderProps } from "../../../types/import";

export default function ImportHeader({
	state,
	setState,
	callbacks,
}: ImportHeaderProps) {
	const { URL, loading } = state;
	const { handleRemoteImport, handleLocalImport } = callbacks;

	const setURL = (value: string) => {
		setState({ ...state, URL: value });
	};

	return (
		<Box px={3} mb={2}>
			<Heading fontSize={44} mt={3}>Import</Heading>
			<VStack space={4} bg="transparent" alignItems="center" mt={5}>
				<Box alignItems="center">
					<Input
						w="100%"
						type="text"
						placeholder="https://example.com"
						onChangeText={setURL}
						value={URL}
						keyboardType="url"
						InputRightElement={
							<Button size="xs" w="1/6" h="full" onPress={handleRemoteImport} isLoading={loading.remote} {...ButtonProps}>
								Go
							</Button>
						}
						{...InputProps}
					/>
				</Box>

				<Text color="muted.600" fontSize={16}>OR</Text>

				<Button w="full" onPress={handleLocalImport} isLoading={loading.local} {...ButtonProps}>
					Import from device
				</Button>
			</VStack>
			{state.downloadingList.length > 0 && (<Heading size="md" mt={6} mb={2} px={1}>Downloading</Heading>)}
		</Box>
	);
}
