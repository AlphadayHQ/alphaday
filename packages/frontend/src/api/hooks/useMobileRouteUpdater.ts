import { useHistory, useLocation } from "react-router";
import { mobileRoutes } from "src/routes";
import { TKeyword } from "../types";
import { useResolvedView } from "./useResolvedView";
import { useViewRoute } from "./useViewRoute";

interface IMobileRouteInfo {
    isTabBarHidden: boolean;
    isBoardRoute: boolean;
}

export const useMobileRouteUpdater = (): IMobileRouteInfo => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { pathContainsHashOrSlug } = useViewRoute();
    const isTabBarHidden = !!mobileRoutes.find(
        (route) =>
            route.type !== "fallback" &&
            route.path === pathname &&
            route?.hideTabBar
    );
    const resolvedView = useResolvedView();

    if (resolvedView.currentData !== undefined) {
        const { keywords } = resolvedView.currentData;
        const searchSlugs = keywords.map((kw: TKeyword) => kw.tag.slug);

        const newRoute = `/superfeed/search/${[...new Set(searchSlugs)].join(",")}`;

        if (pathContainsHashOrSlug && pathname !== newRoute) {
            history.push(newRoute);
        }
    }

    return {
        isTabBarHidden,
        isBoardRoute: pathContainsHashOrSlug,
    };
};
