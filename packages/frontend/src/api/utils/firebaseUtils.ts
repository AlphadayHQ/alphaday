import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import CONFIG from "src/config/config";

// Initialize Firebase
const { APP_CONFIG } = CONFIG.FIREBASE;
export const isConfigured = !!APP_CONFIG.apiKey;
export const firebaseApp = isConfigured ? initializeApp(APP_CONFIG) : undefined;
export const analytics = getAnalytics(firebaseApp);
