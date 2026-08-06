export const AUTH_CONFIG = {
  GOOGLE_WEB_CLIENT_ID: (import.meta as any).env?.VITE_FIREBASE_WEB_CLIENT_ID || process.env.VITE_FIREBASE_WEB_CLIENT_ID || "",
};