import { Alert } from "react-native";
import { ConfigKeys } from "../constants/config";
import { FontFamiliesEnum } from "../constants/fonts";
import { GlobalAction, GlobalActionType } from "../context/GlobalReducer";
import { clearDatabase } from "./database.util";
import { deleteAll } from "./file.util";
import { getAsyncStorage } from "./storage.util";

export default class SettingsUtil {
  private readonly dispatch: (event: GlobalAction) => any;

  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  public loadSettings = async () => {
    const fontSize = await getAsyncStorage(ConfigKeys.FONT_SIZE);
    const fontFamily = await getAsyncStorage(ConfigKeys.FONT_FAMILY);
    const deleteFilesAfterImport = !!Number(
      await getAsyncStorage(ConfigKeys.DELETE_FILES_AFTER_IMPORT)
    );
    const useSinglePageLayout = !!Number(
      await getAsyncStorage(ConfigKeys.SINGLE_PAGE_LAYOUT)
    );
    this.dispatch({
      type: GlobalActionType.LOAD_SETTINGS,
      payload: {
        fontSize,
        fontFamily,
        deleteFilesAfterImport,
        useSinglePageLayout,
      },
    });
  };

  public setFontSize = (fontSize: string) => {
    if (!isNaN(parseInt(fontSize))) {
      this.dispatch({
        type: GlobalActionType.SET_FONT_SIZE,
        payload: parseInt(fontSize),
      });
    }
  };

  public setFontFamily = (fontFamily: FontFamiliesEnum) => {
    this.dispatch({
      type: GlobalActionType.SET_FONT_FAMILY,
      payload: fontFamily,
    });
  };

  public setDeleteFilesAfterImport = (deleteFilesAfterImport: boolean) => {
    const val = deleteFilesAfterImport ? 1 : 0;
    this.dispatch({
      type: GlobalActionType.SET_DELETE_FILES_AFTER_IMPORT,
      payload: val,
    });
  };

  public toggleSinglePageLayout = (value: boolean) => {
    const val = value ? 1 : 0;
    this.dispatch({
      type: GlobalActionType.SET_SINGLE_PAGE_LAYOUT_OPTION,
      payload: val,
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
