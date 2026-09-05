import { Injectable, inject, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { NotTodoService } from './not-todo.service';
import {
  cancelScheduledNotifications,
  scheduleRandomNotifications,
  scheduleTestNotification,
} from '../utility/notification.util';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private readonly storageKey = 'remindersEnabled';
  private readonly notTodo = inject(NotTodoService);
  readonly enabled = signal(false);
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = this.initInternal();
    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private async initInternal(): Promise<void> {
    const result = await Preferences.get({ key: this.storageKey });
    this.enabled.set(result.value === 'true');
    this.initialized = true;

    if (this.enabled()) {
      await this.syncSchedule({ requestPermission: false });
    }
  }

  async setEnabled(isEnabled: boolean): Promise<boolean> {
    await this.init();

    if (!isEnabled) {
      this.enabled.set(false);
      await Preferences.set({ key: this.storageKey, value: 'false' });
      await cancelScheduledNotifications();
      return true;
    }

    const scheduled = await this.syncSchedule({
      requestPermission: true,
      force: true,
    });

    if (!scheduled) {
      this.enabled.set(false);
      await Preferences.set({ key: this.storageKey, value: 'false' });
      return false;
    }

    this.enabled.set(true);
    await Preferences.set({ key: this.storageKey, value: 'true' });
    await this.ensureExactAlarms();
    return true;
  }

  async syncSchedule(
    options: { requestPermission?: boolean; force?: boolean } = {}
  ): Promise<boolean> {
    await this.init();
    if (!options.force && !this.enabled()) {
      return false;
    }

    const items = await this.notTodo.getItems();
    return scheduleRandomNotifications(items, 3, {
      requestPermission: !!options.requestPermission,
    });
  }

  async sendTestReminder(): Promise<'sent' | 'no-items' | 'denied'> {
    await this.init();
    const items = await this.notTodo.getItems();
    if (!items.length) {
      return 'no-items';
    }

    const sent = await scheduleTestNotification(items[0]);
    return sent ? 'sent' : 'denied';
  }

  private async ensureExactAlarms(): Promise<void> {
    if (Capacitor.getPlatform() !== 'android') {
      return;
    }

    try {
      const status = await LocalNotifications.checkExactNotificationSetting();
      if (status.exact_alarm !== 'granted') {
        await LocalNotifications.changeExactNotificationSetting();
      }
    } catch (error) {
      console.warn('[notifications] Exact alarm setting unavailable', error);
    }
  }
}
