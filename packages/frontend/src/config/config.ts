import API_CONFIG from "./backend";
import FIREBASE_CONFIG from "./firebase";
import NUMBERS from "./numbers";
import ROUTING_CONFIG from "./routing";
import SEO_CONFIG from "./seo";
import {
    API_PROVIDERS,
    EXPLORERS,
    WALLET_CONNECT,
    UNISWAP,
} from "./thirdparty";
import UI_CONFIG from "./ui";
import USER_CONFIG from "./user";
import VIEWS_CONFIG from "./views";
import WIDGETS_CONFIG from "./widgets";

// order is important here
export enum EEnvironments {
    Test = "test",
    Development = "dev",
    Staging = "staging",
    Production = "production",
}

const IS_TEST = import.meta.env.REACT_APP_ENVIRONMENT === EEnvironments.Test;
const IS_DEV =
    import.meta.env.REACT_APP_ENVIRONMENT === EEnvironments.Development ||
    !import.meta.env.REACT_APP_ENVIRONMENT;
const IS_STAGING =
    import.meta.env.REACT_APP_ENVIRONMENT === EEnvironments.Staging;
const IS_PROD =
    import.meta.env.REACT_APP_ENVIRONMENT === EEnvironments.Production;

const ENVIRONMENT = (() => {
    const env = import.meta.env.REACT_APP_ENVIRONMENT ?? "";
    if (Object.values(EEnvironments).includes(env)) {
        return env as EEnvironments;
    }
    return EEnvironments.Development;
})();

const LOGLEVEL =
    import.meta.env.REACT_APP_LOGLEVEL != null
        ? parseInt(import.meta.env.REACT_APP_LOGLEVEL, 10)
        : 0;

const SENTRY = {
    DSN: import.meta.env.REACT_APP_SENTRY_DSN,
    ENABLE: true,
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
    IS_DEV,
    IS_STAGING,
    IS_PROD,
    LOGLEVEL,
    API: API_CONFIG,
    ROUTING: ROUTING_CONFIG,
    UI: UI_CONFIG,
    WIDGETS: WIDGETS_CONFIG,
    SEO: SEO_CONFIG,
    FIREBASE: FIREBASE_CONFIG,
    SENTRY,
    COOKIES,
    API_PROVIDERS,
    NUMBERS,
    EXPLORERS,
    WALLET_CONNECT,
    UNISWAP,
    VIEWS: VIEWS_CONFIG,
    USER: USER_CONFIG,
    APP: {
        VERSION: import.meta.env.REACT_APP_VERSION || "",
        STORAGE_KEY: "alphaday",
        STORAGE_VERSION: 19,
        COMMIT: import.meta.env.REACT_APP_COMMIT,
        X_APP_ID: import.meta.env.REACT_APP_X_APP_ID || "",
        X_APP_SECRET: import.meta.env.REACT_APP_X_APP_SECRET || "",
    },
};

export default CONFIG;
