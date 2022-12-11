import {MaterialIcons} from "@expo/vector-icons";
import {Box, Heading, Icon, Input, Pressable} from "native-base";
import {InputProps} from "../constants/props";
import LoadingHeader from "./LoadingHeader";

interface HeaderComponentProps {
	state: {
		search: string;
		loading: boolean;
		initialLoad: boolean;
	};
	setters: {
		setSearch: (value: string) => void;
	}
}


export default function HomeHeader({state, setters}: HeaderComponentProps) {

	const {search, loading, initialLoad} = state;
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
	  </Box>
	)
}