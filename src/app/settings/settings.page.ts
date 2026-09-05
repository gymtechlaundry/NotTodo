import { Component, inject } from '@angular/core';
import { NotTodoService } from '../services/not-todo.service';
import { ReminderService } from '../services/reminder.service';
import { IonHeader, IonContent, IonToggle, IonLabel, IonItem, IonText, IonNote, IonButton, ToastController } from '@ionic/angular/standalone';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [IonNote, IonText, IonItem, IonLabel, IonToggle, IonContent, IonHeader, IonButton, ToolbarComponent],
})
export class SettingsPage {
  private readonly reminderService = inject(ReminderService);
  private readonly notTodoService = inject(NotTodoService);
  private readonly toastController = inject(ToastController);
  private toggleReady = false;

  remindersEnabled = this.reminderService.enabled;

  constructor() {
    this.init();
  }

  async init() {
    await this.reminderService.init();
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
