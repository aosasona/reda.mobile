import { Alert } from "react-native";
import { ConfigKeys } from "../constants/config";
import { GlobalAction, GlobalActionType } from "../context/GlobalReducer";
import defaultStorage from "../storage/default";
import { clearDatabase } from "./database.util";
import { deleteAll } from "./file.util";

export default class SettingsUtil {
  private readonly dispatch: (event: GlobalAction) => any;

  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  public loadSettings = async () => {
    const useSinglePageLayout = defaultStorage.getBoolean(
      ConfigKeys.SINGLE_PAGE_LAYOUT
    );
    this.dispatch({
      type: GlobalActionType.LOAD_SETTINGS,
      payload: {
        useSinglePageLayout,
      },
    });
  };

  public toggleSinglePageLayout = (value: boolean) => {
    this.dispatch({
      type: GlobalActionType.SET_SINGLE_PAGE_LAYOUT_OPTION,
      payload: value,
    });
  };

  public resetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: () =>
            this.dispatch({ type: GlobalActionType.RESET_SETTINGS }),
          style: "destructive",
        },
      ]
    );
  };

  public clearAllData = () => {
    Alert.alert("Clear All Data", "Are you sure you want to clear all data?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        onPress: () => {
          const clearDB = clearDatabase();
          const delAll = deleteAll();
          Promise.all([delAll, clearDB])
            .then(() =>
              Alert.alert(
                "Success",
                "Data cleared! Restart app to see changes."
              )
            )
            .catch((e) => Alert.alert("Error", "An error occurred"));
        },
        style: "destructive",
      },
    ]);
  };
}
