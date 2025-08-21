import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2c72319814ca45fdb82bddf31e4113af',
  appName: 'AquaTracker - Water Habit Tracker',
  webDir: 'dist',
  server: {
    url: 'https://2c723198-14ca-45fd-b82b-ddf31e4113af.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0EA5E9',
      showSpinner: false
    }
  }
};

export default config;