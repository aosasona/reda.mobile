import {Box, Text} from "native-base";
import {ReactNode} from "react";

interface Props {
	title: string;
	children: ReactNode;
	hideTitle?: boolean;
}

export default function SettingsSection({
	title,
	children,
  	hideTitle,
}: Props) {
	return (
	  <Box mt={4} mb={2}>
		  {!hideTitle && <Text mb={2.5} px={3} opacity={0.4}>
			  {title}
		  </Text>}
		  <Box
			_dark={{bg: "muted.900", borderColor: "muted.800"}}
			_light={{bg: "muted.100", borderColor: "muted.200"}}
		  >
			  <Box>{children}</Box>
		  </Box>
	  </Box>
	);
}