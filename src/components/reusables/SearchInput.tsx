import { MaterialIcons } from "@expo/vector-icons";
import { Icon, Input, Pressable } from "native-base";
import { InputProps } from "../../config/props";

interface SearchInputProps {
	search: string;
	setSearch: any;
	placeholder?: string;
}

export default function SearchInput({ search, setSearch, placeholder = "search..." }: SearchInputProps) {
	return (
		<Input
			w="full"
			type="text"
			keyboardType="web-search"
			placeholder={placeholder}
			onChangeText={setSearch}
			value={search}
			autoCapitalize="none"
			autoCorrect={true}
			enablesReturnKeyAutomatically
			px={2}
			mx="auto"
			InputRightElement={
				search ? (
					<Pressable _pressed={{ opacity: 0.5 }} px={3} onPress={() => setSearch("")}>
						<Icon as={MaterialIcons} name="cancel" size={5} _dark={{ color: "muted.800" }} _light={{ color: "muted.400" }} />
					</Pressable>
				) : <></>
			}
			InputLeftElement={
				<Icon as={MaterialIcons} name="search" size={5} ml={2} _dark={{ color: "muted.600" }} _light={{ color: "muted.400" }} />
			}
			{...InputProps}
		/>
	);
}
