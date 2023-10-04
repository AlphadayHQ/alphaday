import { lazy, LazyExoticComponent } from "react";

/**
 * A basic route.
 *
 * It defines the path and the component to be rendered.
 */
export interface IRoute {
    path: ERouteNames;
    component: LazyExoticComponent<React.FC>;
    exact?: boolean;
}

/**
 * Enum of all routes in the app.
 *
 * @remarks
 * This is used to generate the routes in the app.
 * Please note that any route that is defined here will be automatically
 * added to the app.
 */
export enum ERouteNames {
    Base = "/",
    Boards = "/b/:slug",
    FallBack = "*",
}

/**
 * An array of all valid routes in the app.
 *
 * We reverse the array so that the fallback route is always the last one.
 * This is because its dx-wise, it's more intuitive to order the routes from
 * most specific to least specific.
 */
export const routes: IRoute[] = [
    {
        path: ERouteNames.Base,
        component: lazy(() => import("./pages/index")),
        exact: true,
    },
    {
        path: ERouteNames.Boards,
        component: lazy(() => import("./pages/index")),
    },
    {
        path: ERouteNames.FallBack,
        component: lazy(() => import("./pages/error")),
    },
].reverse();

/**
 * An array of routes in the app.
 */
export const loadRoutes: IRoute[] = [
    {
        path: ERouteNames.Base,
        component: lazy(() => import("./pages/index")),
        exact: true,
    },
    {
        path: ERouteNames.FallBack,
        component: lazy(() => import("./pages/preloader")),
    },
].reverse();
