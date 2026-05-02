import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'vercel.app.ahmadkurniaprisma.cashflowintelliegence',
  appName: 'Cash Flow Intelligence',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "1030868000164-bis69dbhtsmkm7qa1i38i91oprefke80.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    },
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: false,
      backgroundColor: "#042f2e",
      androidSplashResourceName: "splash",
      fade: false
    }
  }
};

export default config;