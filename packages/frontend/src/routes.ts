import { lazy, LazyExoticComponent } from "react";

/**
 * A basic route.
 *
 * It defines the path and the component to be rendered.
 */
export interface IRoute {
    path: ERouteNames;
    component: LazyExoticComponent<() => JSX.Element>;
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
];
