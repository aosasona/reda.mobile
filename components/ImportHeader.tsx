import {Box, Button, Heading, Input, Text, VStack} from "native-base";
import {ButtonProps, InputProps} from "../constants/props";
import {ImportStatesProps} from "../types/import";

interface Props {
	state: ImportStatesProps;
	setState: (value: ImportStatesProps) => void;
	callbacks: {
		handleRemoteImport: () => void;
		handleLocalImport: () => void;
	}
}

export default function ImportHeader({state, setState, callbacks}: Props) {

	const {URL, loading} = state;
	const {handleRemoteImport, handleLocalImport} = callbacks;

	const setURL = (value: string) => {
		setState({...state, URL: value});
	}

	return (
	  <Box mb={2} safeAreaTop>
		  <Heading fontSize={44} mt={4}>Import</Heading>
		  <VStack space={4} bg="transparent" alignItems="center" mt={4}>
			  <Box alignItems="center">
				  <Input
					w="100%"
					type="text"
					placeholder="example.com"
					onChangeText={setURL}
					value={URL}
					InputLeftElement={<Text ml={3} color="muted.400">https://</Text>}
					InputRightElement={
						<Button
						  size="xs"
						  w="1/6"
						  h="full"
						  onPress={handleRemoteImport}
						  _text={{fontSize: 14, fontWeight: 500}}
						  {...ButtonProps}
						  rounded={0}
						>
							Go
						</Button>
					}
					{...InputProps}
				  />
			  </Box>

			  <Text color="muted.600" fontSize={16}>OR</Text>

			  <Button
				w="full"
				onPress={handleLocalImport}
				isLoading={loading.local}
				{...ButtonProps}
			  >
				  Import from device
			  </Button>
		  </VStack>
		  {state.downloadingList.length > 0 && <Heading size="md" mt={6} mb={2} px={1}>Downloading</Heading>}
	  </Box>
	)
}