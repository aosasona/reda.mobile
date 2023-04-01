import CustomPressable, { CustomPressableProps } from "../../custom/CustomPressable";
import StaticSettings from "./StaticSettings";

interface Props extends CustomPressableProps {
}

export default function PressableSettings({ children, onPress, disabled }: Props = { disabled: false, onPress: () => { }, children: null, }) {
  return (
    <CustomPressable onPress={onPress} disabled={disabled}>
      <StaticSettings>{children}</StaticSettings>
    </CustomPressable>
  );
}
