import {MaterialIcons} from "@expo/vector-icons";
import {Box, Heading, Icon, Input, Pressable, ScrollView} from "native-base";
import {useState} from "react";
import {InputProps} from "../constants/props";

export default function Home() {

	const [search, setSearch] = useState("");

	return (
	  <ScrollView>
		  <Box safeAreaTop>
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
		  </Box>
	  </ScrollView>
	)
}