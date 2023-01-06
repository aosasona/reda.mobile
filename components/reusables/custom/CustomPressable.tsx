import {Pressable} from "native-base";
import {ReactNode} from "react";
import {PressableProps} from "../../../constants/props";

export interface CustomPressableProps {
	  children: ReactNode;
	  onPress: () => any;
	  disabled?: boolean;
}

export default function CustomPressable({ children, onPress, disabled }: CustomPressableProps) {
	return (
		  <Pressable onPress={onPress} disabled={disabled} {...PressableProps}>
			  {children}
		  </Pressable>
	  )
}