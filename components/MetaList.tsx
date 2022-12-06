import {Entypo, MaterialIcons} from "@expo/vector-icons";
import {Actionsheet, Box, Button, FlatList, Flex, Heading, HStack, Icon, Input, PresenceTransition, Pressable, Text} from "native-base";
import {useWindowDimensions} from "react-native";
import {ActionSheetProps, ButtonProps, InputProps} from "../constants/props";
import {File} from "../utils/file.util";
import MetaListCard from "./MetaListCard";
import MetaPage from "./MetaPage";

export default function MetaList({
	isOpen,
	next,
	previous,
	step,
	setStep,
	search,
	setSearch,
	file,
	allMetadata,
	currentMetadata,
	onMetadataSelect,
	handleModalClose,
}: { isOpen: boolean, next: () => void; previous: () => void; file: File; step: number, setStep: () => void; search: string; setSearch: (str: any) => void, allMetadata: any[], currentMetadata: any, onMetadataSelect: (item: number) => void, handleModalClose: () => void }) {

	const {height} = useWindowDimensions();

	const forwardTransition = {
		translateX: 100,
		opacity: 0,
	}

	const backwardTransition = {
		translateX: -100,
		opacity: 0,
	}

	const transitionAnimation = {
		opacity: 1,
		translateX: 0,
		transition: {
			duration: 250,
		},
	}

	const ListEmptyComponent = <Flex h={height * 0.6} alignItems="center" justifyContent="center">
		<Box>
			<Icon as={Entypo} name="info-with-circle" size={20} _dark={{color: "muted.800"}} _light={{color: "muted.300"}}/>
			<Text _dark={{color: "muted.800"}} _light={{color: "muted.300"}} mt={3}>
				No books found
			</Text>
		</Box>
	</Flex>

	return (
	  <Actionsheet isOpen={isOpen} onClose={handleModalClose} _backdrop={{opacity: 0.8}}>

		  {step === 0 && <Actionsheet.Content position="relative" px={4} {...ActionSheetProps}>
			  <PresenceTransition
				visible={step === 0}
				initial={backwardTransition}
				animate={transitionAnimation}
			  >
				  <HStack justifyContent="space-between" alignItems="flex-end" my={2}>
					  <Heading fontSize={40} fontWeight="extrabold" textAlign="left" px={1}>
						  Search
					  </Heading>
					  <Text fontSize={12} opacity={0.5}>Showing {allMetadata?.length || 0} results</Text>
				  </HStack>
				  <Input
					w="full"
					type="text"
					placeholder="Search..."
					onChangeText={setSearch}
					value={search}
					mt={1}
					InputRightElement={
						search
						  ? <Pressable _pressed={{opacity: 0.5}} p={4} onPress={() => setSearch("")}>
							  <Icon
								as={MaterialIcons}
								name="cancel"
								size={5}
								_dark={{color: "muted.800"}}
								_light={{color: "muted.400"}}
							  />
						  </Pressable>
						  : <></>
					}
					{...InputProps}
				  />

				  <Box>
					  <FlatList
						bg="transparent"
						data={allMetadata}
						renderItem={({item, index}) => <MetaListCard data={item} index={index} onPress={onMetadataSelect}/>}
						keyExtractor={(item, index) => index.toString()}
						ListEmptyComponent={ListEmptyComponent}
						ListFooterComponent={<Box h={192}/>}
						showsVerticalScrollIndicator={false}
						px={0}
						mt={4}
						maxHeight={height - 200}
					  />
				  </Box>
				  <Box w="full" position="absolute" bottom={24} safeAreaBottom={true}>
					  <Button
						w="full"
						onPress={next}
						{...ButtonProps}
					  >
						  Continue
					  </Button>
				  </Box>
			  </PresenceTransition>
		  </Actionsheet.Content>}

		  {step === 1 && <Actionsheet.Content {...ActionSheetProps}>
			  <PresenceTransition
				visible={step === 1}
				initial={forwardTransition}
				animate={transitionAnimation}
			  >
				  <MetaPage data={currentMetadata} file={file} next={next} previous={previous}/>
			  </PresenceTransition>
		  </Actionsheet.Content>}

	  </Actionsheet>
	);
}