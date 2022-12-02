import {Actionsheet, Box, Button, Center, Input, ScrollView, Text, useDisclose, VStack} from "native-base";
import {useState} from "react";

export default function Import() {

	const [URL, setURL] = useState("");

	const {
		isOpen,
		onOpen,
		onClose,
	} = useDisclose();

	const handleURLDownload = () => {}

	return (
	  <ScrollView>
		  <Box mt={2}>
			  <VStack space={4} bg="transparent" alignItems="center">
				  <Box alignItems="center">
					  <Input
						w="100%"
						type="text"
						variant="filled"
						placeholder="https://"
						fontSize={14}
						borderWidth={0}
						_light={{bg: "muted.200", _focus: {bg: "muted.200"}}}
						_dark={{bg: "muted.900", _focus: {bg: "muted.900"}}}
						py={3}
						rounded={8}
						onChangeText={setURL}
						value={URL}
						InputRightElement={
							<Button
							  size="xs"
							  rounded="none"
							  w="1/6" h="full"
							  _light={{bg: "muted.900", _text: {color: "muted.100"}}}
							  _dark={{bg: "muted.100", _text: {color: "muted.900"}}}
							  _pressed={{opacity: 0.8, bg: "muted.400"}}
							  onPress={handleURLDownload}
							  _text={{fontSize: 14, fontWeight: 500}}
							>
								Go
							</Button>
						}
					  />
				  </Box>

				  <Text color="muted.600" fontSize={16}>OR</Text>

				  <Button
					w="full" fontSize={12}
					_light={{bg: "muted.900", _text: {color: "muted.100"}}}
					_dark={{bg: "muted.100", _text: {color: "muted.900"}}}
					_pressed={{opacity: 0.8, bg: "muted.400"}}
					rounded={8} py={3}
					onPress={onOpen}
				  >
					  Import from device
				  </Button>
			  </VStack>

			  <Center>
				  <Actionsheet isOpen={isOpen} onClose={onClose}>
					  <Actionsheet.Content bg="muted.900">

					  </Actionsheet.Content>
				  </Actionsheet>
			  </Center>

			  {/* <Heading color="muted.600" px={1} mt={10}>Pending Downloads</Heading> */}
		  </Box>

	  </ScrollView>
	)
}