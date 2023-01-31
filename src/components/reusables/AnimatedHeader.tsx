import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { ScrollThresholdData } from "../../hooks/useScroll";

interface AnimatedHeaderProps {
  Component: React.FunctionComponent;
  page: ScrollThresholdData;
  dependsOn?: any[];
}

export default function AnimatedHeader(props: AnimatedHeaderProps) {
  const { page, dependsOn, Component } = props;
  const navigation = useNavigation();
  const dependencies = dependsOn || [];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: page.hasReachedThreshold,
      header: Component,
      headerRight: () => null,
      headerLeft: () => null,
      headerTransparent: true,
    });
  }, [navigation, page.hasReachedThreshold, ...dependencies]);
  return null;
}
