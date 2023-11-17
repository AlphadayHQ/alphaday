import "./polyfills";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { WagmiConfig } from "wagmi";
import { AppContextProvider } from "./api/store/providers/app-context-provider";
import PersistProvider from "./api/store/providers/persist-provider";
import { wagmiConfig } from "./api/store/providers/wallet-connect-provider";
// TODO (xavier-charles): add themes support import ThemeProvider from "./api/store/providers/theme-provider";
import { store } from "./api/store/store";
import { ECookieChoice } from "./api/types";
import { Logger } from "./api/utils/logging";
import App from "./App";
import Seo from "./components/seo/Seo";
import CONFIG from "./config";

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
        (!CONFIG.IS_PROD ||
            (cookieChoice != null &&
                typeof cookieChoice === "number" &&
                cookieChoice === ECookieChoice.AcceptAll))
    ) {
        Logger.debug("initializing sentry...");
        Sentry.init({
            dsn: CONFIG.SENTRY.DSN,
            integrations: [new BrowserTracing()],
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

const container = document.getElementById("root");
if (!container) {
    // TODO: Replace with a proper logger
    throw new Error("Root element not found");
}
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <PersistProvider>
            <Seo />
            <AppContextProvider>
                {/* <ThemeProvider> */}
                <WagmiConfig config={wagmiConfig}>
                    <App />
                </WagmiConfig>
                {/* </ThemeProvider> */}
            </AppContextProvider>
        </PersistProvider>
    </Provider>
);
