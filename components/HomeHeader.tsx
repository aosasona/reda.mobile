import {MaterialIcons} from "@expo/vector-icons";
import {Box, Heading, HStack, Icon, Input, Pressable, Text} from "native-base";
import {InputProps} from "../constants/props";
import {CombinedFileResultType} from "../utils/database.util";
import LoadingHeader from "./LoadingHeader";

interface HeaderComponentProps {
	state: {
		search: string;
		loading: boolean;
		initialLoad: boolean;
		files: CombinedFileResultType[] | null;
	};
	setters: {
		setSearch: (value: string) => void;
	}
}

interface AllFilesProps {
	files: CombinedFileResultType[];
}

export default function HomeHeader ({state, setters}: HeaderComponentProps) {

	const {search, loading, initialLoad, files} = state;
	const {setSearch} = setters;

	return (
	  <Box w={"full"} safeAreaTop>
		  <Heading fontSize={44} mt={4} ml={2}>Home</Heading>
		  <Input
			type="text"
			placeholder="Search"
			onChangeText={setSearch}
			value={search}
			px={2}
			mt={4}
			InputRightElement={
				search ?
				  <Pressable _pressed={{opacity: 0.5}} p={4} onPress={() => setSearch("")}>
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
			InputLeftElement={
				<Icon as={MaterialIcons} name="search" size="sm" ml={3} _dark={{color: "muted.600"}} _light={{color: "muted.400"}}/>
			}
			{...InputProps}
		  />

		  {!initialLoad && loading && <LoadingHeader/>}

		  {files && files.length > 0 && <AllFiles files={files}/>}
	  </Box>
	)
}

const AllFiles = ({files}: AllFilesProps) => {
	return (
	  <HStack alignItems="flex-end" justifyContent="space-between" space={4} px={2} mt={4} mb={4}>
		  <Heading fontSize={28}>All</Heading>
		  <Pressable _pressed={{opacity: 0.5}} p={0} m={0}>
			  <Text fontSize={13} color="blue.500">Show All</Text>
		  </Pressable>
	  </HStack>
	)
}