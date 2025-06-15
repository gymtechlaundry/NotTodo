import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-root',
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
  }
}
