import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { isHash } from "src/api/utils/helpers";
import CONFIG from "src/config/config";
import { EMobileRoutePaths, EDesktopRoutePaths } from "src/routes";
import { FULLSIZE_ROUTES_ARR } from "src/types";

enum ERouteType {
    Hash,
    Slug,
}

interface IViewRouteInfo {
    /**
     * Base view path info. Gives the hash or slug of the current view
     */
    routeInfo:
        | {
              value: string | undefined;
              type: ERouteType;
          }
        | undefined;
    /**
     * true if the current url contains a hash or a slug
     */
    pathContainsHashOrSlug: boolean;
    /**
     * Current full-size widget URL path, if the current URL corresponds to a full-size widget
     */
    fullSizeWidgetPath: string | undefined;
    /**
     * true if the current url is a full-size widget path
     */
    isFullSize: boolean;
    /**
     * true if the current routeInfo contains a view hash
     */
    isViewHash: boolean;
    /**
     * true if the current path is root path
     */
    isRoot: boolean;
    /**
     * true if the current path is superfeed path
     */
    isSuperfeed: boolean;
    /**
     * true if the current path is boards library path
     */
    isBoardsLibrary: boolean;
    /**
     * true if the current path is widgets path
     */
    isWidgetsLibrary: boolean;
}

export const useViewRoute = (): IViewRouteInfo => {
    const routeLocation = useLocation();
    /**
     * (@elcharitas): This is a hack to get the location object from the react-router-dom
     *
     * React-Router v5 has a bug(it may also not be a bug, I can't say) where
     * the location object is not reflected as expected when the route changes
     * It's weird but it's why we get this multiple rerendering issue.
     * We should watch for a proper fix in the future.
     *
     * TODO: Remove this hack when react-router v6 support is added to ionic
     * Ref: https://github.com/ionic-team/ionic-framework/issues/24177
     */
    const location = (
        "location" in routeLocation ? routeLocation.location : routeLocation
    ) as Location;

    const fullSizeWidgetPath = useMemo(() => {
        const fullSizeWidgetTest = CONFIG.ROUTING.REGEXPS.FULL_SIZE_WIDGET.exec(
            location.pathname
        );
        if (
            fullSizeWidgetTest !== null &&
            fullSizeWidgetTest[1] !== undefined
        ) {
            const fullSizeWidgetPathTest = fullSizeWidgetTest[1];
            if (
                FULLSIZE_ROUTES_ARR.indexOf(`/${fullSizeWidgetPathTest}`) !== -1
            ) {
                return fullSizeWidgetPathTest;
            }
        }
        return undefined;
    }, [location.pathname]);

    const routeInfo = useMemo(() => {
        const hashOrSlugTest = CONFIG.ROUTING.REGEXPS.VIEW.exec(
            location.pathname
        );
        if (hashOrSlugTest !== null && hashOrSlugTest[1] !== undefined) {
            const hashOrSlug = hashOrSlugTest[1];
            if (isHash(hashOrSlug)) {
                return {
                    value: hashOrSlug,
                    type: ERouteType.Hash,
                };
            }
            return {
                value: hashOrSlug,
                type: ERouteType.Slug,
            };
        }
        return undefined;
    }, [location.pathname]);

    const pathContainsHashOrSlug = useMemo(
        () =>
            routeInfo !== undefined &&
            routeInfo.value.length > 0 &&
            (routeInfo.type === ERouteType.Hash ||
                routeInfo.type === ERouteType.Slug),
        [routeInfo]
    );

    const isViewHash = useMemo(
        () => routeInfo !== undefined && routeInfo.type === ERouteType.Hash,
        [routeInfo]
    );

    return {
        routeInfo,
        pathContainsHashOrSlug,
        fullSizeWidgetPath,
        isFullSize: fullSizeWidgetPath !== undefined,
        isViewHash,
        isRoot: location.pathname === "/",
        isSuperfeed: location.pathname.includes(EMobileRoutePaths.Superfeed),
        isBoardsLibrary: location.pathname.includes(
            EDesktopRoutePaths.BoardsLibrary
        ),
        isWidgetsLibrary: location.pathname.includes(
            EDesktopRoutePaths.Widgets
        ),
    };
};

export default useViewRoute;
