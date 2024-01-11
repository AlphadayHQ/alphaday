import { breakpoints } from "@alphaday/ui-kit";
import { isMobile } from "../utils/helpers";
import { useWindowSize } from "./useWindowSize";

/**
 * @returns true if the current device is mobile
 */
export const useIsMobile = () => {
    const { width } = useWindowSize();
    const isMobileAgent = isMobile();

    return width < breakpoints.TwoColMinWidth || isMobileAgent;
};
