import { breakpoints } from "@alphaday/ui-kit";
import CONFIG from "src/config";
import { EFeaturesRegistry } from "src/constants";
import { isMobile } from "../utils/helpers";
import { useFeatureFlags } from "./useFeatureFlags";
import { useWindowSize } from "./useWindowSize";

/**
 * @returns true if the current device is mobile
 */
export const useIsMobile = (): boolean | undefined => {
    const { enabled: isMobileEnabled, isLoading } = useFeatureFlags(
        EFeaturesRegistry.MobileApp
    );
    const { width } = useWindowSize();
    const isMobileAgent = isMobile();

    /**
     * If we are in dev or local, we want to show the mobile view
     */
    if (CONFIG.IS_DEV || CONFIG.IS_LOCAL) {
        return width < breakpoints.TwoColMinWidth;
    }

    if (isLoading) return undefined;

    /**
     * If the mobile app feature flag is disabled, we don't want to
     * show the mobile view/pwa on prod
     */
    if (!isMobileEnabled) {
        return false;
    }

    /**
     * If we are in prod, we want to show the mobile view only if the device is mobile
     */
    return isMobileAgent;
};
