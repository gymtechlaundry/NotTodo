import { LocalNotifications } from "@capacitor/local-notifications";
import { NotToDoItem } from "../models/not-todo-item";

export async function cancelScheduledNotifications() {
  // Remove anything already shown in the notification center
  await LocalNotifications.removeAllDeliveredNotifications();

  // Cancel EVERYTHING that’s pending (scheduled but not shown yet)
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length) {
    await LocalNotifications.cancel({ notifications: pending.notifications });
  }
}

export async function scheduleRandomNotifications(
  items: NotToDoItem[],
  timesPerDay: number = 3
) {
  if (!items?.length || timesPerDay <= 0) return;

  // Ensure permission first (no-op if already granted)
  await LocalNotifications.requestPermissions();

  // Start clean
  await cancelScheduledNotifications();

  // Dedup by title, keep the first occurrence
  const fails = [
    ...new Map(
      items.filter(i => i.failCount > 0).map(item => [item.title, item])
    ).values(),
  ];
  if (!fails.length) return;

  const notifications = [];
  for (let i = 0; i < timesPerDay; i++) {
    const randomItem = fails[Math.floor(Math.random() * fails.length)];
    const fireDate = getRandomFutureTimeWithinWindow(8, 22); // 8AM–10PM

    notifications.push({
      title: "NOT To-Do Reminder",
      body: `Reminder: Don't "${randomItem.title}" today!`,
      id: makeNotificationId(i),
      schedule: { at: fireDate },
    });
  }

  await LocalNotifications.schedule({ notifications });
  console.log(`[🔔 Scheduled ${notifications.length} notifications]`);
}

/**
 * Returns a random Date in the future, within [startHour, endHour).
 * If the random time today has already passed, it shifts to tomorrow.
 */
function getRandomFutureTimeWithinWindow(startHour: number, endHour: number): Date {
  if (endHour <= startHour) {
    throw new Error("endHour must be greater than startHour");
  }

  const now = new Date();
  const candidate = new Date(now);

  const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour; // [start, end-1]
  const minute = Math.floor(Math.random() * 60);

  candidate.setHours(hour, minute, 0, 0);

  // If that time is in the past (today), schedule for tomorrow at the same time
  if (candidate.getTime() <= now.getTime()) {
    candidate.setDate(candidate.getDate() + 1);
  }

  return candidate;
}

/** Generates a reasonably unique numeric ID */
function makeNotificationId(suffix = 0): number {
  // 53-bit safe combo of timestamp + random + loop suffix
  const ts = Date.now() % 1_000_000_000; // keep it smaller
  const rnd = Math.floor(Math.random() * 1_000_000);
  return Number(`${ts}${rnd}${suffix}`.slice(-9)); // stays within int range most platforms expect
}