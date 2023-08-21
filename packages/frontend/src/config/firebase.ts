const FIREBASE_CONFIG = {
    APP_CONFIG: {
        apiKey: import.meta.env.VITE_FIRE_API_KEY,
        authDomain: import.meta.env.VITE_FIRE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIRE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIRE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIRE_MESSAGE_SENDER_ID,
        appId: import.meta.env.VITE_FIRE_APP_ID,
        measurementId: import.meta.env.VITE_FIRE_MEASUREMENT_ID,
    },
    DEFAULT_ROOM: "merge",
};

export default FIREBASE_CONFIG;
