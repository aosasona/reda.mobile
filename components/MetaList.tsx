import {Entypo} from "@expo/vector-icons";
import {Box, Button, FlatList, Flex, Heading, HStack, Icon, Input, Text} from "native-base";
import {Alert, useWindowDimensions} from "react-native";
import {ButtonProps, InputProps} from "../constants/props";
import {MetaModalProps} from "../types/import";
import MetaListCard from "./MetaListCard";

export default function MetaList({functions, state}: MetaModalProps) {

	const {height} = useWindowDimensions();
	const {meta} = state;
	const {toggleStep, handleCurrentMetaChange} = functions;

	const onPress = (item: any, index: number) => handleCurrentMetaChange(item, index)

	return (
	  <>
		  <FlatList
			bg="transparent"
			data={meta?.all}
			renderItem={({item, index}) => <MetaListCard state={{data: item, index, meta}} functions={{onPress}}/>}
			keyExtractor={(item, index) => index.toString()}
			ListHeaderComponent={<ListHeaderComponent state={state} functions={functions}/>}
			ListEmptyComponent={ListEmptyComponent}
			ListFooterComponent={<Box h={128}/>}
			showsVerticalScrollIndicator={false}
			stickyHeaderIndices={[0]}
			px={0}
			mt={0}
		  />
		  <Box w="full" position="absolute" bottom={2} safeAreaBottom={true}>
			  <Button
				w="full"
				onPress={toggleStep}
				{...ButtonProps}
			  >
				  Continue
			  </Button>
		  </Box>
	  </>
	);
}

export const ListHeaderComponent = ({functions, state}: MetaModalProps) => {

	const {search, meta, loading} = state;
	const {setState, loadAllMeta} = functions;
	const handleSearchChange = (value: string) => setState(prevState => ({...prevState, search: value}));

	const handleSearch = () => {
		if (search.length > 0) {
			loadAllMeta(search).then().catch(() => {
				Alert.alert("Error", "An error occurred!");
			})
		}
	}

	return (
	  <Box w="full" _dark={{bg: "muted.900"}} _light={{bg: "muted.100"}} pb={4} mb={2}>
		  <HStack justifyContent="space-between" alignItems="flex-end" my={2}>
			  <Heading fontSize={40} fontWeight="extrabold" textAlign="left" px={1}>
				  Search
			  </Heading>
			  <Text fontSize={12} opacity={0.5}>Showing {meta?.all?.length || 0} results</Text>
		  </HStack>
		  <Input
			w="full"
			type="text"
			placeholder="Search..."
			onChangeText={handleSearchChange}
			value={search}
			mt={1}
			InputRightElement={
				<Button
				  size="xs"
				  w="1/6"
				  h="full"
				  onPress={handleSearch}
				  _text={{fontSize: 14, fontWeight: 500}}
				  isLoading={loading.meta}
				  {...ButtonProps}
				  rounded={0}
				>
					<Icon
					  as={Entypo}
					  name="magnifying-glass"
					  size={5}
					  _dark={{color: "muted.900"}}
					  _light={{color: "muted.100"}}
					/>
				</Button>
			}
			{...InputProps}
			_dark={{bg: "muted.800", placeholderTextColor: "muted.500", _focus: {bg: "muted.800"}}}
			_light={{bg: "muted.200", placeholderTextColor: "muted.500", _focus: {bg: "muted.200"}}}
		  />
	  </Box>
	)
}

export const ListEmptyComponent = () => {

	const {height, width} = useWindowDimensions();

	return (
	  <Flex w={width * 0.9} h={height * 0.4} alignItems="center" justifyContent="center">
		  <Box>
			  <Icon as={Entypo} name="info-with-circle" size={20} _dark={{color: "muted.800"}} _light={{color: "muted.300"}}/>
			  <Text _dark={{color: "muted.800"}} _light={{color: "muted.300"}} mt={3}>
				  No results found.
			  </Text>
		  </Box>
	  </Flex>
	)
}