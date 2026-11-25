import "./polyfills";
import "./i18n";
import { Suspense } from "react";
import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import { clarity } from "react-microsoft-clarity";
import { Provider } from "react-redux";
// import { useIsMobile } from "src/api/hooks";
import { registerSW } from "virtual:pwa-register";
import { WagmiConfig } from "wagmi";
import { AppContextProvider } from "./api/store/providers/app-context-provider";
import PersistProvider from "./api/store/providers/persist-provider";
import { wagmiConfig } from "./api/store/providers/wallet-connect-provider";
// TODO (xavier-charles): add themes support import ThemeProvider from "./api/store/providers/theme-provider";
import { store } from "./api/store/store";
import { ECookieChoice } from "./api/types";
import { lazyRetry, isMobile } from "./api/utils/helpers";
import { Logger } from "./api/utils/logging";
import CONFIG from "./config";
import SeoContainer from "./containers/seo/SeoContainer";
import PreloaderPage from "./pages/preloader";

// const MobileApp = lazyRetry(() => import("./MobileApp"));
const App = lazyRetry(() => import("./App"));

/**
 * The production CSP is a <meta> tag (see csp.config.ts), which can't send
 * violation reports, so a script or request it blocks would otherwise fail
 * silently. Log violations and send them to Sentry (when Sentry is enabled).
 * Violations caused by browser extensions are ignored, and blocked URLs are
 * reduced to origin + path so query strings (e.g. API keys) aren't sent.
 */
const EXTENSION_URL = /^(chrome|moz|safari(-web)?|ms-browser)-extension:/;
const stripQuery = (uri: string): string => {
    try {
        const { origin, pathname } = new URL(uri);
        return origin + pathname;
    } catch {
        return uri; // "inline", "eval", etc.
    }
};
document.addEventListener("securitypolicyviolation", (e) => {
    if (EXTENSION_URL.test(e.blockedURI) || EXTENSION_URL.test(e.sourceFile)) {
        return;
    }
    const blocked = stripQuery(e.blockedURI);
    Logger.warn("CSP violation", e.effectiveDirective, blocked);
    Sentry.captureMessage(
        `CSP violation: ${e.effectiveDirective} blocked ${blocked}`,
        "warning"
    );
});

/**
 * Enable automatic page reload.
 * We adopted the `autoUpdate` behavior, but according to the workbox docs
 * the app wouldn't reload unless we import at least one virtual module in the app code.
 * See https://vite-pwa-org.netlify.app/guide/auto-update.html
 */
registerSW({ immediate: true });

/**
 * at this point, the store is still not loaded and we can't read the state
 * so we instead try to read local storage directly to retrieve users' cookie
 * choices
 */
try {
    const persistedState = JSON.parse(
        localStorage.getItem(`persist:${String(CONFIG.APP.STORAGE_KEY)}`) ||
            "{}"
    );
    // eslint-disable-next-line
    const { cookieChoice } = JSON.parse(persistedState?.ui || "{}");
    if (
        CONFIG.SENTRY.ENABLE &&
        !CONFIG.IS_LOCAL &&
        (!CONFIG.IS_PROD ||
            (cookieChoice != null &&
                typeof cookieChoice === "number" &&
                cookieChoice === ECookieChoice.AcceptAll))
    ) {
        Logger.debug("initializing sentry...");
        Sentry.init({
            dsn: CONFIG.SENTRY.DSN,
            integrations: [Sentry.browserTracingIntegration()],
            environment: CONFIG.ENVIRONMENT,
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 0.1,
            release: `frontend@${String(CONFIG.APP.VERSION)}`,
        });
    }
} catch (e) {
    Logger.error(
        "index.tsx: could not retrieve cookie choice. Sentry won't be enabled",
        e
    );
}

if (CONFIG.CLARITY.ENABLE) {
    if (isMobile() && CONFIG.CLARITY.MOBILE_PROJECT_ID) {
        Logger.debug("initializing clarity for mobile...");
        clarity.init(CONFIG.CLARITY.MOBILE_PROJECT_ID);
        clarity.consent();
        Logger.debug("clarity initialized");
    } else if (CONFIG.CLARITY.PROJECT_ID) {
        Logger.debug("initializing clarity for desktop...");
        clarity.init(CONFIG.CLARITY.PROJECT_ID);
        clarity.consent();
        Logger.debug("clarity initialized");
    }
}

const AppSwitcher = () => {
    // const isMobileApp = useIsMobile();
    return (
        <Suspense fallback={<PreloaderPage />}>
            {/* {isMobileApp ? <MobileApp /> : isMobileApp !== undefined && <App />} */}
            <App />
        </Suspense>
    );
};

const container = document.getElementById("root");
if (!container) {
    // TODO: Replace with a proper logger
    throw new Error("Root element not found");
}
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <PersistProvider>
            <SeoContainer />
            <AppContextProvider>
                <WagmiConfig config={wagmiConfig}>
                    <AppSwitcher />
                </WagmiConfig>
            </AppContextProvider>
        </PersistProvider>
    </Provider>
);
