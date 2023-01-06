import {HStack, Switch} from "native-base";
import {ReactNode} from "react";
import {HStackProps} from "../../../constants/props";
import CustomDivider from "../../reusables/custom/CustomDivider";

interface Props {
	children: ReactNode;
	hideDivider?: boolean;
}

export default function StaticSettings({ children, hideDivider }: Props = { hideDivider: false, children: null }) {
	return (
	  <>
		  <HStack {...HStackProps}>
			  {children}
		  </HStack>
		  {!hideDivider && <CustomDivider />}
	  </>
	)
}