import { LocalNotifications } from "@capacitor/local-notifications";
import { NotToDoItem } from "../models/not-todo-item";

export async function cancelScheduledNotifications() {
  await LocalNotifications.cancel({ notifications: [] });
}

export async function scheduleRandomNotifications(items: NotToDoItem[], timesPerDay: number = 3) {
  if (items.length === 0 || timesPerDay <= 0) return;

  const fails = items.filter(i => i.failCount > 0);
  if (fails.length === 0) return;

  const notifications = [];

  for (let i = 0; i < timesPerDay; i++) {
    const randomItem = fails[Math.floor(Math.random() * fails.length)];
    const fireDate = generateRandomTimeBetween(8, 22); // Between 8AM and 10PM

    notifications.push({
      title: 'NOT To-Do Reminder',
      body: `Reminder: Don't "${randomItem.title}" today!`,
      id: Date.now() + i,
      schedule: {
        at: fireDate,
      },
    });
  }

  await LocalNotifications.schedule({ notifications });
  console.log(`[🔔 Scheduled ${notifications.length} notifications]`);
}

function generateRandomTimeBetween(startHour: number, endHour: number): Date {
  const now = new Date();
  const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const minute = Math.floor(Math.random() * 60);
  const fireDate = new Date();
  fireDate.setHours(hour, minute, 0, 0);
  return fireDate;
}