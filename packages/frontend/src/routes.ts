import { lazy } from "react";

const ErrorPage = lazy(() => import("./pages/error"));
const PreloaderPage = lazy(() => import("./pages/preloader"));
const BoardsPage = lazy(() => import("./pages/index"));

/**
 * A basic route.
 *
 * It defines the path and the component to be rendered.
 */
export interface IRoute {
    path: ERouteNames;
    component: typeof ErrorPage | typeof PreloaderPage | typeof BoardsPage;
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
export const appRoutes: IRoute[] = [
    {
        path: ERouteNames.Base,
        component: BoardsPage,
        exact: true,
    },
    {
        path: ERouteNames.Boards,
        component: BoardsPage,
    },
    {
        path: ERouteNames.FallBack,
        component: ErrorPage,
    },
];

/**
 * An array of routes in the app.
 */
export const loadRoutes: IRoute[] = [
    {
        path: ERouteNames.Base,
        component: BoardsPage,
        exact: true,
    },
    {
        path: ERouteNames.FallBack,
        component: PreloaderPage,
    },
];

/**
 * An array of routes in the app.
 */
export const errorRoutes: IRoute[] = [
    {
        path: ERouteNames.FallBack,
        component: ErrorPage,
    },
];
