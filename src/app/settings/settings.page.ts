import { Component, inject } from '@angular/core';
import { NotTodoService } from '../services/not-todo.service';
import { ReminderService } from '../services/reminder.service';
import { AppLockService } from '../services/app-lock.service';
import {
  IonHeader,
  IonContent,
  IonToggle,
  IonLabel,
  IonItem,
  IonText,
  IonNote,
  IonButton,
  ToastController,
} from '@ionic/angular/standalone';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import {
  NOT_TODO_PRIVACY_URL,
  NOT_TODO_SUPPORT_URL,
  NOT_TODO_TERMS_URL,
  STUDIO_COPYRIGHT,
  STUDIO_CREDIT,
  STUDIO_URL,
} from '../core/config/studio';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [
    IonNote,
    IonText,
    IonItem,
    IonLabel,
    IonToggle,
    IonContent,
    IonHeader,
    IonButton,
    ToolbarComponent,
  ],
})
export class SettingsPage {
  private readonly reminderService = inject(ReminderService);
  private readonly notTodoService = inject(NotTodoService);
  private readonly appLock = inject(AppLockService);
  private readonly toastController = inject(ToastController);
  private toggleReady = false;

  remindersEnabled = this.reminderService.enabled;
  appLockEnabled = this.appLock.enabled;

  readonly privacyUrl = NOT_TODO_PRIVACY_URL;
  readonly termsUrl = NOT_TODO_TERMS_URL;
  readonly supportUrl = NOT_TODO_SUPPORT_URL;
  readonly studioUrl = STUDIO_URL;
  readonly studioCredit = STUDIO_CREDIT;
  readonly studioCopyright = STUDIO_COPYRIGHT;

  constructor() {
    this.init();
  }

  async init() {
    await this.reminderService.init();
    await this.appLock.init();
    this.toggleReady = true;
  }

  async onToggle(event: CustomEvent<{ checked: boolean }>) {
    if (!this.toggleReady) {
      return;
    }

    const isEnabled = event.detail.checked;
    const ok = await this.reminderService.setEnabled(isEnabled);

    if (isEnabled && !ok) {
      await this.showToast('Notification permission is required for reminders.');
      return;
    }

    if (isEnabled) {
      const items = await this.notTodoService.getItems();
      await this.showToast(
        items.length
          ? 'Reminders on. You will get 3 nudges a day between 8am and 10pm.'
          : 'Reminders on. Add a not-to-do and they will start firing.'
      );
      return;
    }

    await this.showToast('Reminders off.');
  }

  async onLockToggle(event: CustomEvent<{ checked: boolean }>) {
    if (!this.toggleReady) {
      return;
    }

    const isEnabled = event.detail.checked;
    const ok = await this.appLock.setEnabled(isEnabled);
    if (!ok) {
      await this.showToast(
        isEnabled
          ? 'Could not turn on lock. Use Face ID, fingerprint, or your device passcode.'
          : 'Unlock to turn off app lock.'
      );
      return;
    }

    await this.showToast(
      isEnabled
        ? 'App lock on. Anyone opening Not ToDo will need to unlock first.'
        : 'App lock off.'
    );
  }

  async sendTestReminder() {
    const result = await this.reminderService.sendTestReminder();
    if (result === 'no-items') {
      await this.showToast('Add a not-to-do first, then try a test reminder.');
      return;
    }
    if (result === 'denied') {
      await this.showToast('Notification permission is required for reminders.');
      return;
    }
    await this.showToast('Test reminder coming in 3 seconds.');
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
    });
    await toast.present();
  }
}
