import {Button, HStack, Text, useColorMode} from "native-base";

interface ImportTabProps {
	tabs: string[];
	currentTab: number;
	onTabChange: (tab: number) => void;
}

export default function ImportTab({tabs, currentTab, onTabChange}: ImportTabProps) {

	const {colorMode} = useColorMode();
	const tabButtonColor = (tab: number) => {
		if (tab !== currentTab) {
			return "transparent";
		} else {
			return (colorMode === "dark") ? "muted.900" : "muted.200"
		}
	};

	return (

	  <HStack alignItems="center" space={2}>
		  {tabs.map((tab, index) => (
			<Button key={index} w="49%" bg={tabButtonColor(index)} _pressed={{bg: "transparent"}} onPress={() => onTabChange(index)}>
				<Text fontSize={12}>{tab}</Text>
			</Button>
		  ))}
	  </HStack>
	)
}