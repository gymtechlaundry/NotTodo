import { Injectable, signal } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';

@Injectable({
  providedIn: 'root',
})
export class AppLockService {
  private readonly storageKey = 'appLockEnabled';
  readonly enabled = signal(false);
  readonly locked = signal(false);
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
    if (!Capacitor.isNativePlatform()) {
      // Browser has no Face ID. Treat it as a passcode-protected device so
      // Settings and the lock gate can be exercised with the plugin confirm.
      await BiometricAuth.setDeviceIsSecure(true);
    }

    const result = await Preferences.get({ key: this.storageKey });
    this.enabled.set(result.value === 'true');
    this.locked.set(this.enabled());
    this.initialized = true;
    this.listenForBackground();
  }

  async setEnabled(isEnabled: boolean): Promise<boolean> {
    await this.init();

    if (isEnabled) {
      const ok = await this.authenticate('Turn on app lock');
      if (!ok) {
        return false;
      }
      this.enabled.set(true);
      this.locked.set(false);
      await Preferences.set({ key: this.storageKey, value: 'true' });
      return true;
    }

    const ok = await this.authenticate('Turn off app lock');
    if (!ok) {
      return false;
    }
    this.enabled.set(false);
    this.locked.set(false);
    await Preferences.set({ key: this.storageKey, value: 'false' });
    return true;
  }

  async unlock(): Promise<boolean> {
    await this.init();
    const ok = await this.authenticate('Unlock Not ToDo');
    if (ok) {
      this.locked.set(false);
    }
    return ok;
  }

  private listenForBackground(): void {
    if (Capacitor.isNativePlatform()) {
      App.addListener('appStateChange', ({ isActive }) => {
        if (!isActive && this.enabled()) {
          this.locked.set(true);
        }
      });
      return;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.enabled()) {
        this.locked.set(true);
      }
    });
  }

  private async authenticate(reason: string): Promise<boolean> {
    try {
      const status = await BiometricAuth.checkBiometry();
      if (!status.isAvailable && !status.deviceIsSecure) {
        return false;
      }

      await BiometricAuth.authenticate({
        reason,
        cancelTitle: 'Cancel',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Use passcode',
        androidTitle: 'Not ToDo',
        androidSubtitle: reason,
        androidConfirmationRequired: false,
      });
      return true;
    } catch (error) {
      console.warn('[app-lock] Authentication failed', error);
      return false;
    }
  }
}
