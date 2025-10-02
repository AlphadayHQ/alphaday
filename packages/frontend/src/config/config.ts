import API_CONFIG from "./backend";
import BOARDS_CONFIG from "./boards";
import FIREBASE_CONFIG from "./firebase";
import NUMBERS from "./numbers";
import ROUTING_CONFIG from "./routing";
import SEO_CONFIG from "./seo";
import { SUPERFEED_CONFIG } from "./superfeed";
import {
    API_PROVIDERS,
    EXPLORERS,
    WALLET_CONNECT,
    UNISWAP,
    OAUTH,
} from "./thirdparty";
import UI_CONFIG from "./ui";
import USER_CONFIG from "./user";
import VIEWS_CONFIG from "./views";
import { WIDGETS_CONFIG, TWO_COL_WIDGETS_CONFIG } from "./widgets";

// order is important here
export enum EEnvironments {
    Test = "test",
    Development = "dev",
    Staging = "staging",
    Production = "production",
}

const IS_TEST = import.meta.env.VITE_ENVIRONMENT === EEnvironments.Test;
const IS_LOCAL = import.meta.env.MODE === "development" && import.meta.env.DEV;
const IS_DEV =
    import.meta.env.VITE_ENVIRONMENT === EEnvironments.Development ||
    !import.meta.env.VITE_ENVIRONMENT;
const IS_STAGING = import.meta.env.VITE_ENVIRONMENT === EEnvironments.Staging;
const IS_PROD = import.meta.env.VITE_ENVIRONMENT === EEnvironments.Production;

const ENVIRONMENT = (() => {
    const env = import.meta.env.VITE_ENVIRONMENT ?? "";
    if (Object.values(EEnvironments).includes(env)) {
        return env as EEnvironments;
    }
    return EEnvironments.Development;
})();

const LOGLEVEL =
    import.meta.env.VITE_LOGLEVEL != null
        ? Number.parseInt(import.meta.env.VITE_LOGLEVEL, 10)
        : 0;

const SENTRY = {
    ENABLE: true,
    DSN: import.meta.env.VITE_SENTRY_DSN,
};

const CLARITY = {
    ENABLE: true,
    PROJECT_ID: import.meta.env.VITE_CLARITY_PROJECT_ID,
    MOBILE_PROJECT_ID: import.meta.env.VITE_CLARITY_MOBILE_PROJECT_ID,
};

const HOTJAR = {
    ENABLE: false,
    SITE_ID: import.meta.env.VITE_HOTJAR_SITE_ID,
    SNIPPET_VERSION: import.meta.env.VITE_HOTJAR_SNIPPET_VERSION,
};

const COOKIES = {
    // in these, a "reject all" option will be included
    STRICT_COUNTRY_LIST: ["DE", "FR", "UK", "IE"],
};

/**
 * experimental features for which we may want
 * to control their availability across environments
 */
export type TFeatureEnvironment = EEnvironments | "none";
const CONFIG = {
    ENVIRONMENT,
    IS_TEST,
    IS_LOCAL,
    IS_DEV,
    IS_STAGING,
    IS_PROD,
    LOGLEVEL,
    API: API_CONFIG,
    BOARDS: BOARDS_CONFIG,
    ROUTING: ROUTING_CONFIG,
    UI: UI_CONFIG,
    WIDGETS: WIDGETS_CONFIG,
    TWO_COL_WIDGETS: TWO_COL_WIDGETS_CONFIG,
    SUPERFEED: SUPERFEED_CONFIG,
    SEO: SEO_CONFIG,
    FIREBASE: FIREBASE_CONFIG,
    SENTRY,
    CLARITY,
    HOTJAR,
    COOKIES,
    API_PROVIDERS,
    NUMBERS,
    EXPLORERS,
    WALLET_CONNECT,
    UNISWAP,
    OAUTH,
    VIEWS: VIEWS_CONFIG,
    USER: USER_CONFIG,
    APP: {
        VERSION: import.meta.env.VITE_VERSION || "",
        STORAGE_KEY: "alphaday",
        STORAGE_VERSION: 108,
        COMMIT: import.meta.env.VITE_COMMIT,
        COMMIT_TIMESTAMP: import.meta.env.VITE_COMMIT_TS || "",
        X_APP_ID: import.meta.env.VITE_X_APP_ID || "",
        X_APP_SECRET: import.meta.env.VITE_X_APP_SECRET || "",
    },
};

export default CONFIG;
