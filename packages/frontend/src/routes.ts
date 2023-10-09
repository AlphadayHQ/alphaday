import { lazy } from "react";

const PreloaderPage = lazy(() => import("./pages/preloader"));
const DashboardPage = lazy(() => import("./pages/index"));
const ErrorPage = lazy(() => import("./pages/error"));

/**
 * A basic route.
 *
 * It defines the path and the component to be rendered.
 */
export interface IRoute {
    path: ERouteNames;
    component: typeof ErrorPage | typeof PreloaderPage | typeof DashboardPage;
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
 */
export const appRoutes: IRoute[] = [
    {
        path: ERouteNames.Base,
        component: DashboardPage,
        exact: true,
    },
    {
        path: ERouteNames.Boards,
        component: DashboardPage,
    },
];

/**
 * An array of routes in the app.
 */
export const loadRoutes: IRoute[] = [
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
