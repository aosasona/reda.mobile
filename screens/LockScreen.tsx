import { Box, View } from "native-base";
import { ViewProps } from "../constants/props";
import { ScreenProps } from "../types/general";

export default function LockScreen({ navigation }: ScreenProps) {
  return (
    <View flex={1} {...ViewProps}>
      <Box></Box>
    </View>
  );
}
