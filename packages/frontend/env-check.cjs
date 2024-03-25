const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables from .env file
const envResult = dotenv.config({ path: '.env.production' });

if (envResult.error) {
    console.error('Error loading .env file:', envResult.error);
    process.exit(1);
}

const requiredVariables = [
    "VITE_ENVIRONMENT",
    "VITE_API_BASE_URL",
    "VITE_X_APP_ID",
    "VITE_X_APP_SECRET",
    "VITE_ZAPPER_BASE_URL",
    "VITE_ZAPPER_BASE_URL_V2",
    "VITE_COINGECKO_BASE_URL",
    "VITE_WALLET_CONNECT_PROJECT_ID",
    "VITE_SWAP_FEE",
    "VITE_SWAP_FEE_ADDRESS",
    "VITE_GA_MEASUREMENT_ID",
    "VITE_FIRE_APP_ID",
    "VITE_FIRE_PROJECT_ID",
    "VITE_FIRE_MEASUREMENT_ID",
    "VITE_FIRE_API_KEY",
    "VITE_FIRE_AUTH_DOMAIN",
    "VITE_FIRE_STORAGE_BUCKET",
    "VITE_FIRE_MESSAGE_SENDER_ID",
    "VITE_SENTRY_DSN",
    "VITE_HOTJAR_SITE_ID",
    "VITE_HOTJAR_SNIPPET_VERSION",
    "VITE_OAUTH_ID_GOOGLE",
    "VITE_CLARITY_PROJECT_ID",
    "VITE_CLARITY_MOBILE_PROJECT_ID"
];

// Check if all required variables are set
const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

if (missingVariables.length > 0) {
    console.error('Missing required environment variables:', missingVariables.join(', '));
    process.exit(1);
} else {
    console.log('All required environment variables are set.');
}
