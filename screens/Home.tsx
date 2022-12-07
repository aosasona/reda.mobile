import {MaterialIcons} from "@expo/vector-icons";
import {AspectRatio, Box, FlatList, Flex, Heading, HStack, Icon, Image, Input, Pressable, ScrollView, Text, VStack} from "native-base";
import {useEffect, useState} from "react";
import {Alert, RefreshControl, useWindowDimensions} from "react-native";
import ImagePlaceholder from "../components/ImagePlaceholder";
import LoadingHeader from "../components/LoadingHeader";
import {InputProps} from "../constants/props";
import {CombinedFileResultType, getFiles} from "../utils/database.util";

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

export default function Home() {

	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [initialLoad, setInitialLoad] = useState(false);
	const [files, setFiles] = useState<CombinedFileResultType[] | null>([]);

	useEffect(() => {
		(async () => await fetchAllFiles())();
		setInitialLoad(true);
	}, []);

	const fetchAllFiles = async () => {
		try {
			setLoading(true);
			const result = await getFiles() as CombinedFileResultType[] | null;
			setFiles(result);
		}
		catch (e) {
			Alert.alert("Error", "An error occurred while fetching files");
		}
		finally {
			setLoading(false);
		}
	}

	return (
	  <ScrollView refreshControl={
		  <RefreshControl
			refreshing={loading}
			onRefresh={fetchAllFiles}
			progressViewOffset={50}
		  />
	  }>
		  <HeaderComponent state={{files, search, loading, initialLoad}} setters={{setSearch}}/>
		  <FlatList
			data={files}
			horizontal
			showsHorizontalScrollIndicator={false}
			renderItem={({item, index}) => (<FileCard data={item} index={index}/>)}
			keyExtractor={(item, index) => index.toString()}
			ListEmptyComponent={<EmptyComponent/>}
			px={0}
		  />
	  </ScrollView>
	)
}

const HeaderComponent = ({state, setters}: HeaderComponentProps) => {

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

const FileCard = ({data, index}: { data: CombinedFileResultType, index: number }) => {

	const {width} = useWindowDimensions();

	return (
	  <Pressable w={width * 0.44}>
		  <VStack bg="transparent" space={3} mr={3}>
			  <AspectRatio ratio={1}>
				  {data?.image
					? <Image resizeMode="cover" source={{uri: data?.image}} alt={data?.name || ""} rounded={8}/>
					: <ImagePlaceholder/>
				  }
			  </AspectRatio>
			  <Heading fontSize={16} noOfLines={2} px={1}>{data?.name}</Heading>
		  </VStack>
	  </Pressable>
	)
}

const EmptyComponent = () => {

	const {height} = useWindowDimensions();

	return (
	  <Flex h={height * 0.6} alignItems="center" justifyContent="center">
		  <Box alignItems="center">
			  <Icon as={MaterialIcons} name="folder" size={48} _dark={{color: "muted.800"}} _light={{color: "muted.300"}}/>
			  <Heading _dark={{color: "muted.800"}} _light={{color: "muted.300"}} mt={3}>
				  Oops! Empty library
			  </Heading>
		  </Box>
	  </Flex>
	)
}