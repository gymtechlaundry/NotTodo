import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NotToDoItem } from '../models/not-todo-item';

export const REMINDERS_PER_DAY = 3;
export const REMINDER_START_HOUR = 8;
export const REMINDER_END_HOUR = 22;
const REMINDER_IDS = [1001, 1002, 1003];
const TEST_NOTIFICATION_ID = 1999;

export async function cancelScheduledNotifications(): Promise<void> {
  try {
    await LocalNotifications.removeAllDeliveredNotifications();
  } catch (error) {
    console.warn('[notifications] Failed to clear delivered notifications', error);
  }

  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch (error) {
    console.warn('[notifications] Failed to cancel pending notifications', error);
  }
}

export async function ensureNotificationPermission(request: boolean): Promise<boolean> {
  try {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === 'granted') {
      return true;
    }
    if (!request) {
      return false;
    }
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.warn('[notifications] Permission check failed', error);
    return false;
  }
}

export async function scheduleRandomNotifications(
  items: NotToDoItem[],
  timesPerDay: number = REMINDERS_PER_DAY,
  options: { requestPermission?: boolean } = {}
): Promise<boolean> {
  const granted = await ensureNotificationPermission(!!options.requestPermission);
  if (!granted) {
    return false;
  }

  await cancelScheduledNotifications();

  if (!items?.length || timesPerDay <= 0) {
    return true;
  }

  const times = pickDistinctTimes(timesPerDay, REMINDER_START_HOUR, REMINDER_END_HOUR);
  const native = Capacitor.isNativePlatform();
  const notifications = times.map((time, index) => {
    const item = items[Math.floor(Math.random() * items.length)];
    return {
      id: REMINDER_IDS[index] ?? 1000 + index,
      title: 'NOT To-Do Reminder',
      body: `Reminder: Don't "${item.title}" today!`,
      sound: 'default',
      schedule: native
        ? {
            on: { hour: time.hour, minute: time.minute },
            repeats: true,
            allowWhileIdle: true,
          }
        : {
            at: nextOccurrence(time.hour, time.minute),
            allowWhileIdle: true,
          },
    };
  });

  try {
    await LocalNotifications.schedule({ notifications });
    console.log(`[notifications] Scheduled ${notifications.length} reminder(s)`);
    return true;
  } catch (error) {
    console.error('[notifications] Failed to schedule reminders', error);
    return false;
  }
}

export async function scheduleTestNotification(item: NotToDoItem): Promise<boolean> {
  const granted = await ensureNotificationPermission(true);
  if (!granted) {
    return false;
  }

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: TEST_NOTIFICATION_ID,
          title: 'NOT To-Do Reminder',
          body: `Reminder: Don't "${item.title}" today!`,
          sound: 'default',
          schedule: {
            at: new Date(Date.now() + 3000),
            allowWhileIdle: true,
          },
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('[notifications] Failed to schedule test reminder', error);
    return false;
  }
}

export function pickDistinctTimes(
  count: number,
  startHour: number,
  endHour: number
): { hour: number; minute: number }[] {
  if (endHour <= startHour) {
    throw new Error('endHour must be greater than startHour');
  }

  const slots: { hour: number; minute: number }[] = [];
  const seen = new Set<string>();
  let attempts = 0;

  while (slots.length < count && attempts < 200) {
    attempts += 1;
    const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const minute = Math.floor(Math.random() * 60);
    const key = `${hour}:${String(minute).padStart(2, '0')}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    slots.push({ hour, minute });
  }

  return slots;
}

export function nextOccurrence(hour: number, minute: number, now = new Date()): Date {
  const candidate = new Date(now);
  candidate.setHours(hour, minute, 0, 0);
  if (candidate.getTime() <= now.getTime()) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return candidate;
}
