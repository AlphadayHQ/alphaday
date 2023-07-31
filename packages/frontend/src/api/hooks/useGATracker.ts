import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";
import { useCookieChoice } from "src/api/hooks";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";

let isInitialized = false;

export const useGaTracker = (): void => {
    const location = useLocation();

    const { allowTracking } = useCookieChoice();

    if (CONFIG.IS_PROD && allowTracking && !isInitialized) {
        const MEASUREMENT_ID = import.meta.env.REACT_APP_GA_MEASUREMENT_ID;
        if (MEASUREMENT_ID) {
            ReactGA.initialize(MEASUREMENT_ID);
            isInitialized = true;
            Logger.debug("useGaTracker: initialized ");
        } else {
            Logger.warn("useGaTracker: missing measurement ID");
        }
    }

    useEffect(() => {
        if (isInitialized) {
            ReactGA.send("pageview");
        }
    }, [location]);
};
