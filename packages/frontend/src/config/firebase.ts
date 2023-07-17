const FIREBASE_CONFIG = {
    APP_CONFIG: {
        apiKey: process.env.REACT_APP_FIRE_API_KEY,
        authDomain: process.env.REACT_APP_FIRE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIRE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIRE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIRE_MESSAGE_SENDER_ID,
        appId: process.env.REACT_APP_FIRE_APP_ID,
        measurementId: process.env.REACT_APP_FIRE_MEASUREMENT_ID,
    },
    DEFAULT_ROOM: "merge",
};

export default FIREBASE_CONFIG;
