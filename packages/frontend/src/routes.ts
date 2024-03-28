import { lazyRetry } from "./api/utils/helpers";
import PreloaderPage from "./pages/preloader";

/**
 * desktop pages
 */
const DashboardPage = lazyRetry(() => import("./pages/index"));
const ErrorPage = lazyRetry(() => import("./pages/error"));

/**
 * Mobile pages
 */
const SuperfeedPage = lazyRetry(() => import("./mobile-pages/superfeed"));
const Placeholder = lazyRetry(() => import("./mobile-pages/placeholder"));
const AuthPage = lazyRetry(() => import("./mobile-pages/auth"));
const UserFiltersPage = lazyRetry(() => import("./mobile-pages/user-filters"));
const PortfolioPage = lazyRetry(() => import("./mobile-pages/portfolio"));
const NotificationsPage = lazyRetry(
    () => import("./mobile-pages/notifications")
);
const UserSettingsPage = lazyRetry(
    () => import("./mobile-pages/user-settings")
);
const ConnectWalletPage = lazyRetry(
    () => import("./mobile-pages/connect-wallet")
);
const AddWalletPage = lazyRetry(() => import("./mobile-pages/add-wallet"));
const AddHoldingPage = lazyRetry(() => import("./mobile-pages/add-holding"));
const PortfolioHoldingsPage = lazyRetry(
    () => import("./mobile-pages/portfolio-holdings")
);

/**
 * A basic route.
 *
 * It defines the path and the page to be rendered.
 */
export interface IRoute {
    path: EDesktopRoutePaths;
    component: typeof ErrorPage | typeof PreloaderPage | typeof DashboardPage;
    exact?: boolean;
    isFullsize?: boolean;
}

/**
 * Enum of all routes in the desktop app.
 *
 * @remarks
 * This is used to generate the routes in the app.
 * Please note that any route that is defined here will be automatically
 * added to the app.
 */
export enum EDesktopRoutePaths {
    Base = "/",
    Boards = "/b/:slug",
    Calendar = "/b/:slug/calendar",
    CalendarEvent = "/b/:slug/calendar/event/:eventId/:eventTitle",
    FallBack = "*",
}

/**
 * An array of all valid routes in the desktop app.
 */
export const desktopRoutes: IRoute[] = [
    {
        path: EDesktopRoutePaths.Base,
        component: DashboardPage,
        exact: true,
    },
    {
        path: EDesktopRoutePaths.Boards,
        component: DashboardPage,
        exact: true,
    },
    {
        path: EDesktopRoutePaths.Calendar,
        component: DashboardPage,
        isFullsize: true,
        exact: true,
    },
    {
        path: EDesktopRoutePaths.CalendarEvent,
        component: DashboardPage,
        isFullsize: true,
        exact: true,
    },
];

/**
 * An array of invalid routes in the desktop app.
 */
export const errorRoutes: IRoute[] = [
    {
        path: EDesktopRoutePaths.FallBack,
        component: ErrorPage,
    },
];

/**
 * Mobile route definitions
 */

const BASE_TABS_ROUTE = "/";

export enum EMobileTabRoutePaths {
    Superfeed = `${BASE_TABS_ROUTE}superfeed`,
    Portfolio = `${BASE_TABS_ROUTE}portfolio`,
    Market = `${BASE_TABS_ROUTE}market`,
}

export enum EMobileRoutePaths {
    Base = BASE_TABS_ROUTE,
    Superfeed = `${BASE_TABS_ROUTE}superfeed`,
    Search = `${BASE_TABS_ROUTE}superfeed/search/:tags`,
    UserSettings = `${BASE_TABS_ROUTE}superfeed/user-settings`,
    UserFilters = `${BASE_TABS_ROUTE}superfeed/user-filters`,
    Notifications = `${BASE_TABS_ROUTE}superfeed/notifications`,
    Auth = `${BASE_TABS_ROUTE}superfeed/auth`,
    AuthFallback = `${BASE_TABS_ROUTE}auth*`,
    Portfolio = `${BASE_TABS_ROUTE}portfolio`,
    PortfolioConnectWallet = `${BASE_TABS_ROUTE}portfolio/connect-wallet`,
    PortfolioAddWallet = `${BASE_TABS_ROUTE}portfolio/add-wallet`,
    PortfolioAddHolding = `${BASE_TABS_ROUTE}portfolio/add-holding`,
    PortfolioHoldings = `${BASE_TABS_ROUTE}portfolio/holdings`,
    Market = `${BASE_TABS_ROUTE}market`,
}

type TMobileRoute =
    | {
          path: string;
          component: React.FC;
          exact?: boolean;
          authWalled?: boolean;
          redirectTo?: string;
          type: "regular";
      }
    | {
          path: string;
          redirectTo: string;
          exact?: boolean;
          type: "redirect";
      };
export const mobileRoutes: TMobileRoute[] = [
    {
        path: EMobileRoutePaths.Base,
        component: SuperfeedPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.Superfeed,
        component: SuperfeedPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.Search,
        component: SuperfeedPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.UserSettings,
        component: UserSettingsPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.UserFilters,
        component: UserFiltersPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.Auth,
        component: AuthPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.AuthFallback,
        component: AuthPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.Notifications,
        component: NotificationsPage,
        exact: true,
        authWalled: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.Market,
        component: Placeholder,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.Portfolio,
        component: PortfolioPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.PortfolioConnectWallet,
        component: ConnectWalletPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.PortfolioAddWallet,
        component: AddWalletPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.PortfolioAddHolding,
        component: AddHoldingPage,
        exact: true,
        type: "regular",
    },
    {
        path: EMobileRoutePaths.PortfolioHoldings,
        component: PortfolioHoldingsPage,
        exact: true,
        type: "regular",
    },
    /**
     * The following are desktop routes.
     * Ideally we would just use a wildcard `*` to handle all routes that doesn't
     * match those listed above. However, that approach is not working correctly for some
     * reason.
     */
    {
        path: EDesktopRoutePaths.Boards,
        redirectTo: EMobileRoutePaths.Superfeed,
        type: "redirect",
    },
    {
        path: EDesktopRoutePaths.Calendar,
        redirectTo: EMobileRoutePaths.Superfeed,
        type: "redirect",
    },
    {
        path: EDesktopRoutePaths.CalendarEvent,
        redirectTo: EMobileRoutePaths.Superfeed,
        type: "redirect",
    },
    // this doesn't work with IonTabs
    // {
    //     path: "*",
    //     redirectTo: EMobileRoutePaths.Superfeed,
    //     type: "redirect",
    // },
];
