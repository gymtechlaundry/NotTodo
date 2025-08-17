import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private platform = inject(Platform);

  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // Request notification permission
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await LocalNotifications.requestPermissions();
        if (result.display == 'granted') {
          console.log('[✓] Notification permission granted');
        } else {
          console.warn('[!] Notification permission denied');  
        } 
      } catch (error) { 
        console.error('[X] Failed to request notification permissions', error);      
      }
    }

    try {
      await SplashScreen.hide({ fadeOutDuration: 200 });
    } catch (_) {
      // no-op
    }
    setTimeout(() => SplashScreen.hide(), 3000); // safety fallback
  }
}
