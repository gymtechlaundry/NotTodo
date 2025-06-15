import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'not-todo-app',
  webDir: 'www',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
    }
  }
};

export default config;
