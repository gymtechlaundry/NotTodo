import { Preferences } from '@capacitor/preferences';
import { NotTodoService } from '../services/not-todo.service';
import { cancelScheduledNotifications, scheduleRandomNotifications } from '../utility/notification.util';
import { signal, effect, Component } from '@angular/core';
import { IonHeader, IonContent, IonToggle, IonLabel, IonItem, IonToolbar, IonTitle, IonText } from "@ionic/angular/standalone";
import { ToolbarComponent } from "../components/toolbar/toolbar.component";

@Component({
  selector: 'app-home',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [IonText, IonTitle, IonToolbar, IonItem, IonLabel, IonToggle, IonContent, IonHeader, IonItem, IonLabel, IonHeader, IonContent, ToolbarComponent],
})
export class SettingsPage {
  remindersEnabled = signal(false);
  private readonly STORAGE_KEY = 'remindersEnabled';

  constructor(private notTodoService: NotTodoService) {
    this.init();
    effect(() => this.handleToggle(this.remindersEnabled()));
  }

  async init() {
    const result = await Preferences.get({ key: this.STORAGE_KEY });
    this.remindersEnabled.set(result.value === 'true');
  }

async handleToggle(isEnabled: boolean) {
  await Preferences.set({ key: this.STORAGE_KEY, value: isEnabled.toString() });

  if (isEnabled) {
    const items = await this.notTodoService.getItems();
    await scheduleRandomNotifications(items, 3); // ⬅️ 3 reminders/day
  } else {
    await cancelScheduledNotifications();
  }
}
}