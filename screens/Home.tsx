import {Input, ScrollView} from "native-base";

export default function Home() {
	return (
	  <ScrollView>
		  <Input
			type="text"
			variant="filled"
			placeholder="Search"
			fontSize={14}
			borderWidth={0}
			_light={{bg: "muted.200", _focus: {bg: "muted.200"}}}
			_dark={{bg: "muted.900", _focus: {bg: "muted.900"}}}
			py={3} mt={4}
			rounded={8}
		  />

	  </ScrollView>
	)
}