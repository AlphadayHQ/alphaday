import { lazyRetry } from "./api/utils/helpers";
import PreloaderPage from "./pages/preloader";

/**
 * Pages
 */
const DashboardPage = lazyRetry(() => import("./pages/index"));
const ErrorPage = lazyRetry(() => import("./pages/error"));

/**
 * Mobile-only pages
 */
const BoardsPage = lazyRetry(() => import("./mobile-pages/boards"));
const WidgetsPage = lazyRetry(() => import("./mobile-pages/widgets"));

// const SuperfeedPage = lazyRetry(() => import("./mobile-pages/superfeed"));
// const Placeholder = lazyRetry(() => import("./mobile-pages/placeholder"));
// const AuthPage = lazyRetry(() => import("./mobile-pages/auth"));
// const UserFiltersPage = lazyRetry(() => import("./mobile-pages/user-filters"));
// const PortfolioPage = lazyRetry(() => import("./mobile-pages/portfolio"));
// const NotificationsPage = lazyRetry(
//     () => import("./mobile-pages/notifications")
// );
// const UserSettingsPage = lazyRetry(
//     () => import("./mobile-pages/user-settings")
// );
// const ConnectWalletPage = lazyRetry(
//     () => import("./mobile-pages/connect-wallet")
// );
// const AddWalletPage = lazyRetry(() => import("./mobile-pages/add-wallet"));
// const AddHoldingPage = lazyRetry(() => import("./mobile-pages/add-holding"));
// const PortfolioHoldingsPage = lazyRetry(
//     () => import("./mobile-pages/portfolio-holdings")
// );

/**
 * A basic route.
 *
 * It defines the path and the page to be rendered.
 */
export type TRoute =
    | {
          path: ERoutePaths;
          component:
              | typeof ErrorPage
              | typeof PreloaderPage
              | typeof DashboardPage;
          exact?: boolean;
          isFullsize?: boolean;
          type: "regular";
      }
    | {
          path: ERoutePaths;
          component:
              | typeof ErrorPage
              | typeof PreloaderPage
              | typeof DashboardPage;
          exact?: boolean;
          isFullsize?: boolean;
          redirectTo: string;
          type: "redirect";
      };

/**
 * Enum of all routes in the desktop app.
 *
 * @remarks
 * This is used to generate the routes in the app.
 * Please note that any route that is defined here will be automatically
 * added to the app.
 */
export enum ERoutePaths {
    Base = "/",
    Boards = "/b/:slug",
    Calendar = "/b/:slug/calendar",
    CalendarEvent = "/b/:slug/calendar/event/:eventId/:eventTitle",
    FallBack = "*",
    BoardsLibrary = "/boards",
    Widgets = "/widgets",
}

/**
 * An array of all valid routes in the desktop app.
 */
export const desktopRoutes: TRoute[] = [
    {
        type: "regular",
        path: ERoutePaths.Base,
        component: DashboardPage,
        exact: true,
    },
    {
        type: "regular",
        path: ERoutePaths.Boards,
        component: DashboardPage,
        exact: true,
    },
    {
        type: "regular",
        path: ERoutePaths.Calendar,
        component: DashboardPage,
        isFullsize: true,
        exact: true,
    },
    {
        type: "regular",
        path: ERoutePaths.CalendarEvent,
        component: DashboardPage,
        isFullsize: true,
        exact: true,
    },
    {
        type: "regular",
        path: ERoutePaths.BoardsLibrary,
        component: BoardsPage,
        exact: true,
    },
    {
        type: "regular",
        path: ERoutePaths.Widgets,
        component: WidgetsPage,
        exact: true,
    },
];

/**
 * An array of invalid routes in the desktop app.
 */
export const errorRoutes: TRoute[] = [
    {
        type: "regular",
        path: ERoutePaths.FallBack,
        component: ErrorPage,
    },
];

/**
 * Mobile route definitions
 */

// const BASE_TABS_ROUTE = "/";

// export enum EMobileTabRoutePaths {
//     Superfeed = `${BASE_TABS_ROUTE}superfeed`,
//     Portfolio = `${BASE_TABS_ROUTE}portfolio`,
//     Market = `${BASE_TABS_ROUTE}market`,
// }

// export enum EMobileRoutePaths {
//     Base = BASE_TABS_ROUTE,
//     Boards = ERoutePaths.Boards,
//     Superfeed = `${BASE_TABS_ROUTE}superfeed`,
//     Search = `${BASE_TABS_ROUTE}superfeed/search/:tags`,
//     UserSettings = `${BASE_TABS_ROUTE}superfeed/user-settings`,
//     UserFilters = `${BASE_TABS_ROUTE}superfeed/user-filters`,
//     Notifications = `${BASE_TABS_ROUTE}superfeed/notifications`,
//     Auth = `${BASE_TABS_ROUTE}superfeed/auth`,
//     AuthFallback = `${BASE_TABS_ROUTE}auth*`,
//     Portfolio = `${BASE_TABS_ROUTE}portfolio`,
//     PortfolioConnectWallet = `${BASE_TABS_ROUTE}portfolio/connect-wallet`,
//     PortfolioAddWallet = `${BASE_TABS_ROUTE}portfolio/add-wallet`,
//     PortfolioAddHolding = `${BASE_TABS_ROUTE}portfolio/add-holding`,
//     PortfolioHoldings = `${BASE_TABS_ROUTE}portfolio/holdings`,
//     Market = `${BASE_TABS_ROUTE}market`,
// }

// type TMobileRoute = {
//     path: string;
//     component: React.FC;
//     exact?: boolean;
//     authWalled?: boolean;
//     redirectTo?: string;
//     type: "regular";
//     hideTabBar?: boolean;
// };

// export const mobileRoutes: TMobileRoute[] = [
//     {
//         path: EMobileRoutePaths.Superfeed,
//         component: SuperfeedPage,
//         exact: true,
//         type: "regular",
//     },
//     {
//         path: EMobileRoutePaths.Boards,
//         component: SuperfeedPage,
//         exact: true,
//         type: "regular",
//     },
//     {
//         path: EMobileRoutePaths.Search,
//         component: SuperfeedPage,
//         exact: true,
//         type: "regular",
//     },
//     {
//         path: EMobileRoutePaths.UserSettings,
//         component: UserSettingsPage,
//         exact: true,
//         type: "regular",
//         hideTabBar: true,
//     },
//     {
//         path: EMobileRoutePaths.UserFilters,
//         component: UserFiltersPage,
//         exact: true,
//         type: "regular",
//         hideTabBar: true,
//     },
//     {
//         path: EMobileRoutePaths.Auth,
//         component: AuthPage,
//         exact: true,
//         type: "regular",
//         hideTabBar: true,
//     },
//     {
//         path: EMobileRoutePaths.AuthFallback,
//         component: AuthPage,
//         exact: true,
//         type: "regular",
//         hideTabBar: true,
//     },
//     {
//         path: EMobileRoutePaths.Notifications,
//         component: NotificationsPage,
//         exact: true,
//         authWalled: true,
//         type: "regular",
//         hideTabBar: true,
//     },
//     {
//         path: EMobileRoutePaths.Market,
//         component: Placeholder,
//         exact: true,
//         type: "regular",
//     },
//     {
//         path: EMobileRoutePaths.Portfolio,
//         component: PortfolioPage,
//         exact: true,
//         type: "regular",
//     },
//     {
//         path: EMobileRoutePaths.PortfolioConnectWallet,
//         component: ConnectWalletPage,
//         exact: true,
//         type: "regular",
//     },
//     {
//         path: EMobileRoutePaths.PortfolioAddWallet,
//         component: AddWalletPage,
//         exact: true,
//         type: "regular",
//     },
//     {
//         path: EMobileRoutePaths.PortfolioAddHolding,
//         component: AddHoldingPage,
//         exact: true,
//         type: "regular",
//     },
//     {
//         path: EMobileRoutePaths.PortfolioHoldings,
//         component: PortfolioHoldingsPage,
//         exact: true,
//         type: "regular",
//     },
// ];
