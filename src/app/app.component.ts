import { Component, inject } from '@angular/core';
import { IonApp, IonButton, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NotTodoService } from './services/not-todo.service';
import { ReminderService } from './services/reminder.service';
import { AppLockService } from './services/app-lock.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonButton, IonRouterOutlet],
})
export class AppComponent {
  private platform = inject(Platform);
  private notTodoService = inject(NotTodoService);
  private reminderService = inject(ReminderService);
  readonly appLock = inject(AppLockService);

  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    try {
      await this.notTodoService.initDB();
    } catch (error) {
      console.error('[X] Failed to initialize storage', error);
    }

    try {
      await this.appLock.init();
    } catch (error) {
      console.error('[X] Failed to initialize app lock', error);
    }

    if (Capacitor.isNativePlatform()) {
      try {
        const result = await LocalNotifications.requestPermissions();
        if (result.display === 'granted') {
          console.log('[✓] Notification permission granted');
        } else {
          console.warn('[!] Notification permission denied');
        }
      } catch (error) {
        console.error('[X] Failed to request notification permissions', error);
      }
    }

    try {
      await this.reminderService.init();
    } catch (error) {
      console.error('[X] Failed to initialize reminders', error);
    }

    try {
      await SplashScreen.hide({ fadeOutDuration: 200 });
    } catch (_) {
      // no-op
    }
    setTimeout(() => SplashScreen.hide(), 3000); // safety fallback
  }

  async unlock() {
    const ok = await this.appLock.unlock();
    if (!ok) {
      console.warn('[app-lock] Unlock canceled or failed');
    }
  }
}
