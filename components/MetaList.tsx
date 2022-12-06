import {Entypo} from "@expo/vector-icons";
import {Actionsheet, Box, Button, FlatList, Flex, Heading, HStack, Icon, Input, Text} from "native-base";
import {useWindowDimensions} from "react-native";
import {ActionSheetProps} from "../constants/props";
import MetaListCard from "./MetaListCard";

export default function MetaList({
	isOpen,
	next,
	previous,
	step,
	setStep,
	search,
	setSearch,
	allMetadata,
	onMetadataSelect,
	handleModalClose,
}: { isOpen: boolean, next: () => void; previous: () => void; step: number, setStep: () => void; search: string; setSearch: () => void, allMetadata: any[], onMetadataSelect: (item: number) => void, handleModalClose: () => void }) {

	const {height} = useWindowDimensions();

	return (
	  <Actionsheet isOpen={isOpen} onClose={handleModalClose} _backdrop={{opacity: 0.8}}>
		  {step === 0 && (
			<Actionsheet.Content px={4} {...ActionSheetProps}>
				<HStack justifyContent="space-between" alignItems="flex-end" w="full" my={2}>
					<Heading fontSize={40} fontWeight="extrabold" textAlign="left" px={1}>
						Search
					</Heading>
					<Text fontSize={12} opacity={0.5}>Showing {allMetadata?.length || 0} results</Text>
				</HStack>
				<Input
				  w="full"
				  type="text"
				  variant="filled"
				  placeholder="Search..."
				  fontSize={14}
				  borderWidth={0}
				  _light={{bg: "muted.200", _focus: {bg: "muted.200"}}}
				  _dark={{bg: "muted.800", _focus: {bg: "muted.800"}}}
				  rounded={8}
				  onChangeText={setSearch}
				  value={search}
				  mt={1}
				  py={3}
				/>

				{(allMetadata && allMetadata?.length > 0)
				  ? <Box>
					  <FlatList
						bg="transparent"
						data={allMetadata}
						renderItem={({item, index}) => <MetaListCard data={item} index={index} onPress={onMetadataSelect}/>}
						keyExtractor={(item, index) => index.toString()}
						px={0}
						mt={4}
					  />
				  </Box>
				  : <Flex h={height * 0.6} alignItems="center" justifyContent="center">
					  <Box>
						  <Icon as={Entypo} name="info-with-circle" size={20} _dark={{color: "muted.800"}} _light={{color: "muted.300"}}/>
						  <Text _dark={{color: "muted.800"}} _light={{color: "muted.300"}} mt={3}>
							  No books found
						  </Text>
					  </Box>
				  </Flex>
				}
				<Box w="full" position="absolute" bottom={12} px={4}>
					<Button
					  w="full" fontSize={12}
					  _light={{bg: "muted.900", _text: {color: "muted.100"}}}
					  _dark={{bg: "muted.100", _text: {color: "muted.900"}}}
					  _pressed={{opacity: 0.8, bg: "muted.400"}}
					  shadow={4}
					  rounded={8}
					  py={3}
					>
						Continue
					</Button>
				</Box>
			</Actionsheet.Content>
		  )}
		  {step === 1 && (
			<Actionsheet.Content px={4} {...ActionSheetProps}>
			</Actionsheet.Content>
		  )}
	  </Actionsheet>
	)
}