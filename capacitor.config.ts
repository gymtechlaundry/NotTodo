import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.darcsoftware.nottodo',
  appName: 'Not Todo',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
    }
  }
};

export default config;
