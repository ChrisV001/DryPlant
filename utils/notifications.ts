import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Flower } from "./storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationAsync(): Promise<
  string | null
> {
  let token: string | null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
  }

  if (finalStatus !== "granted") {
    return null;
  }

  try {
    const response = await Notifications.getExpoPushTokenAsync();
    token = response.data;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#1A8E2D",
      });
    }
    return token;
  } catch (error) {
    console.error("Error getting push token: ", error);
    return null;
  }
}

export async function scheduleWateringReminder(
  flower: Flower
): Promise<string | undefined> {
  if (!flower.reminder) return;

  try {
    for (const time of flower.times) {
      const [hours, minutes] = time.split(":").map(Number);
      const today = new Date();
      today.setHours(hours, minutes, 0, 0);

      if (today < new Date()) {
        today.setDate(today.getDate() + 1);
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Watering reminder",
          body: `Time to water ${flower.name} (${flower.dosage})`,
          data: { flowerId: flower.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });

      return identifier;
    }
  } catch (error) {
    console.error("Error scheduling watering reminder: ", error);
    return undefined;
  }
}

export async function cancelWateringReminders(flowerId: string): Promise<void> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      const data = notification.content.data as {
        flowerId?: string;
      } | null;
      if (data?.flowerId === flowerId) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }
    }
  } catch (error) {
    console.error("Error canceling watering reminders: ", error);
    return undefined;
  }
}

export async function updateWateringReminders(
  flower: Flower
): Promise<void> {
  try {
    await cancelWateringReminders(flower.id);

    await scheduleWateringReminder(flower);
  } catch (error) {
    console.error("Error updating watering reminder: ",error);
  }
}
