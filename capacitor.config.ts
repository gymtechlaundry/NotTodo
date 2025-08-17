import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.darcsoftware.nottodo',
  appName: 'Not Todo',
  webDir: 'www',
  server: {
    iosScheme: 'capacitor',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#FFFFFE',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP'
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
    }
  }
};

export default config;
