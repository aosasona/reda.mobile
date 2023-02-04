import { NavigationProp } from "@react-navigation/native";
import * as Burnt from "burnt";
import * as Notifications from "expo-notifications";
import { Notification } from "expo-notifications";
import { Alert, Linking } from "react-native";
import { isAndroid } from "../constants/core";
import { Keys } from "../constants/keys";
import defaultStorage from "../storage/default";
import { NotificationData } from "../types/notifications";

export const showToast = (
  title: string,
  message: string,
  toastType: "done" | "error" = "done"
) => {
  Burnt.toast({
    title: isAndroid ? message : "",
    message,
    preset: toastType,
    haptic: toastType === "done" ? "success" : "error",
    duration: 5,
  });
};

export const sendNotification = async (
  title: string,
  message: string,
  data?: NotificationData
) => {
  try {
    const allowNotifications = defaultStorage.getBoolean(
      Keys.ALLOW_NOTIFICATIONS
    );
    if (!allowNotifications) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        data: (data as any) || null,
      },
      trigger: null,
    });
  } catch (err) { }
};

export const openNotificationsSettings = async () => {
  await Linking.openSettings();
};

export const seekPermission = async (): Promise<boolean> => {
  try {
    const status = await Notifications.getPermissionsAsync();
    if (status.granted) return true;
    const perm = await Notifications.requestPermissionsAsync();
    if (!perm.granted) {
      if (!perm.canAskAgain) {
        await openNotificationsSettings();
      }
    }
    return perm.granted;
  } catch (err) {
    Alert.alert("Error", "Unable to toggle notifications preference");
    return false;
  }
};

export const parseNotification = (
  navigation: NavigationProp<any>,
  notification: Notification
) => {
  try {
    const {
      request: {
        content: { data },
      },
    } = notification;

    if (data?.route != null) {
      navigation.navigate(data.route as string, { data: data?.data });
    }
  } catch (err) { }
};
