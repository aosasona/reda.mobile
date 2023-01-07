import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Box, Button, Icon, Text, View, VStack } from "native-base";
import { useContext, useEffect } from "react";
import { ImageBackground, useWindowDimensions } from "react-native";
import AppUtil from "../context/app/app";
import { AppContext } from "../context/app/AppContext";
import { ScreenProps } from "../types/general";

export default function LockScreen({ navigation }: ScreenProps) {
  const { state: appState, dispatch } = useContext(AppContext);

  const { height } = useWindowDimensions();
  const appUtil = new AppUtil(dispatch);

  const handleLocalAuth = async () => {
    if (appState.useBiometrics) {
      await appUtil.unlockWithBiometrics();
    }
  };

  useEffect(() => {
    (async () => await handleLocalAuth())();
  }, []);

  return (
    <View flex={1} bg="brand-dark">
      <StatusBar style="light" />
      <ImageBackground
        source={require("../assets/bg.jpg")}
        resizeMode="cover"
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.8 }}
      >
        <View flex={1} alignItems="center" justifyContent="center">
          <Box
            w="full"
            h={height * 0.86}
            alignItems="center"
            justifyContent="space-between"
            py={4}
            px={6}
          >
            <VStack my={6} space={2}>
              <Icon
                as={Ionicons}
                name="md-lock-closed"
                size={10}
                color="muted.50"
              />
              <Text color="muted.50">Locked</Text>
            </VStack>

            <Button
              w="full"
              bg="brand-light"
              alignItems="center"
              _text={{ color: "brand-dark", fontWeight: "medium" }}
              _pressed={{ opacity: 0.5 }}
              rounded={8}
              py={5}
              onPress={handleLocalAuth}
            >
              {`Unlock with ${appState.usePassword ? "password" : "biometrics"
                }`}
            </Button>
          </Box>
        </View>
      </ImageBackground>
    </View>
  );
}
