import { memo } from "react";
import {
    BrowserRouter,
    Link,
    Redirect,
    Route,
    useHistory,
    useLocation,
} from "react-router-dom";
// import { ReactComponent as BoardsSVG } from "src/assets/icons/grid.svg";
import { ReactComponent as MarketsSVG } from "src/assets/svg/markets.svg";
import { ReactComponent as PortfolioSVG } from "src/assets/svg/portfolio.svg";
import { ReactComponent as SuperfeedSVG } from "src/assets/svg/superfeed.svg";
import { useAuth, useViewRoute } from "./api/hooks";
import CONFIG from "./config";
import ToastContainer from "./containers/toasts/ToastContainer";
import "@alphaday/ui-kit/global.scss";
import {
    EMobileRoutePaths,
    EMobileTabRoutePaths,
    mobileRoutes,
} from "./routes";

const { IS_DEV, BOARDS } = CONFIG;

const boardRoutesHandler = (
    pathname: string,
    callback: (path: string) => void
) => {
    if (pathname in BOARDS.BOARD_SLUG_MAP) {
        const searchSlugs =
            BOARDS.BOARD_SLUG_MAP[
                pathname as keyof typeof BOARDS.BOARD_SLUG_MAP
            ];
        const newRoute = `/superfeed/search/${[...new Set(searchSlugs)].join(",")}`;

        if (pathname !== newRoute) {
            callback(newRoute);
        }
    } else {
        callback(EMobileRoutePaths.Base);
    }
};

const CustomNavTab: React.FC<{
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean;
}> = ({ label, Icon, disabled }) => (
    <div className="inline-flex flex-col items-center justify-center py-3 px-2">
        <span className="rounded-2xl relative">
            <Icon />
        </span>
        <span className="capitalize mt-1 fontGroup-highlightSemi">
            {disabled ? `${label} (soon)` : label}
        </span>
        {/* {disabled && <div className="text-xs leading-3">(soon)</div>} */}
    </div>
);

const RouterChild = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    const { pathContainsHashOrSlug, routeInfo, isRoot } = useViewRoute();

    const { isAuthenticated } = useAuth();
    const isTabBarHidden = !!mobileRoutes.find(
        (route) => route.path === pathname && route?.hideTabBar
    );

    if (pathContainsHashOrSlug && routeInfo?.value) {
        const navigate = (str: string) => history.push(str);
        boardRoutesHandler(routeInfo.value, navigate);

        return null;
    }

    if (isRoot) {
        return (
            <Redirect
                key={EMobileRoutePaths.Base}
                path={EMobileRoutePaths.Base}
                to={EMobileRoutePaths.Superfeed}
                exact
                push
            />
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-hidden">
                {mobileRoutes.map((route) => {
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            exact={route.exact ?? false}
                            render={() =>
                                route.authWalled && !isAuthenticated ? (
                                    <Redirect
                                        key={route.path}
                                        path={route.path}
                                        to={EMobileRoutePaths.Superfeed}
                                        exact={route.exact ?? false}
                                    />
                                ) : (
                                    <route.component />
                                )
                            }
                        />
                    );
                })}
                <Route
                    render={() => (
                        <Redirect
                            key="*"
                            path="*"
                            to={EMobileRoutePaths.Superfeed}
                            exact
                            push
                        />
                    )}
                    exact
                />
            </div>
            <nav
                className="fixed bottom-0 w-full p-2 bg-background border-t border-borderLine"
                style={{
                    display: isTabBarHidden ? "none" : "flex",
                }}
            >
                <Link
                    to={EMobileTabRoutePaths.Superfeed}
                    className={`flex-1 ${
                        pathname === EMobileTabRoutePaths.Superfeed
                            ? "text-primary"
                            : "text-primaryVariant100"
                    }`}
                >
                    <CustomNavTab label="Superfeed" Icon={SuperfeedSVG} />
                </Link>
                {/* <Link
                    to={EMobileRoutePaths.BoardsLibrary}
                    className={`flex-1 ${
                        pathname === EMobileRoutePaths.BoardsLibrary
                            ? "text-primary"
                            : "text-primaryVariant100"
                    }`}
                >
                    <CustomNavTab label="Boards" Icon={BoardsSVG} />
                </Link> */}
                {IS_DEV && (
                    <Link
                        to={EMobileTabRoutePaths.Market}
                        className={`flex-1 ${
                            pathname === EMobileTabRoutePaths.Market
                                ? "text-primary"
                                : "text-primaryVariant100"
                        }`}
                    >
                        <CustomNavTab label="Market" Icon={MarketsSVG} />
                    </Link>
                )}
                <Link
                    to={EMobileTabRoutePaths.Portfolio}
                    className={(() => {
                        if (!IS_DEV) {
                            return "flex-1 pointer-events-none opacity-50";
                        }
                        return `flex-1 ${
                            pathname === EMobileTabRoutePaths.Portfolio
                                ? "text-primary"
                                : "text-primaryVariant100"
                        }`;
                    })()}
                >
                    <CustomNavTab
                        label="Portfolio"
                        Icon={PortfolioSVG}
                        disabled={!IS_DEV}
                    />
                </Link>
            </nav>
        </div>
    );
};

/**
 * TODO: Move user-settings (and any other view that should be accessible from multiple tabs)
 * to a modal.
 * For the MVP it's fine to nest everything within /superfeed
 */
const MobileApp: React.FC = () => {
    return (
        <div className="theme-dark mobile-app">
            <BrowserRouter>
                <RouterChild />
            </BrowserRouter>
            <ToastContainer
                position="bottom-center"
                duration={CONFIG.UI.TOAST_DURATION}
                className="fontGroup-supportBold"
                containerClassName="last:mb-20"
            />
        </div>
    );
};

export default memo(MobileApp);
