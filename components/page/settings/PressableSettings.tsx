import CustomDivider from "../../reusables/custom/CustomDivider";
import CustomPressable, {CustomPressableProps} from "../../reusables/custom/CustomPressable";
import StaticSettings from "./StaticSettings";

interface Props extends CustomPressableProps {
	hideDivider?: boolean;
}

export default function PressableSettings({ children, hideDivider, onPress, disabled }: Props = { hideDivider: false, disabled: false, onPress: () => {}, children: null }) {
	return (
	  <>
		  <CustomPressable onPress={onPress} disabled={disabled}>
			  <StaticSettings hideDivider={hideDivider}>
				  {children}
			  </StaticSettings>
		  </CustomPressable>
	  </>
	)
}