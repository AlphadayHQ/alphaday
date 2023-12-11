import { lazyRetry } from "./api/utils/helpers";
import PreloaderPage from "./pages/preloader";

const DashboardPage = lazyRetry(() => import("./pages/index"));
const ErrorPage = lazyRetry(() => import("./pages/error"));

/**
 * A basic route.
 *
 * It defines the path and the component to be rendered.
 */
export interface IRoute {
    path: ERouteNames;
    component: typeof ErrorPage | typeof PreloaderPage | typeof DashboardPage;
    exact?: boolean;
    isFullsize?: boolean;
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
    Calendar = "/b/:slug/calendar",
    CalendarEvent = "/b/:slug/calendar/event/:eventId/:eventTitle",
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
        exact: true,
    },
    {
        path: ERouteNames.Calendar,
        component: DashboardPage,
        isFullsize: true,
        exact: true,
    },
    {
        path: ERouteNames.CalendarEvent,
        component: DashboardPage,
        isFullsize: true,
        exact: true,
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
