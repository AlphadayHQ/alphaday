import { memo } from "react";
import {
    IonApp,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, useHistory, useLocation } from "react-router-dom";
import { ReactComponent as MarketsSVG } from "src/assets/svg/markets.svg";
import { ReactComponent as PortfolioSVG } from "src/assets/svg/portfolio.svg";
import { ReactComponent as SuperfeedSVG } from "src/assets/svg/superfeed.svg";
import { useAuth, useViewRoute } from "./api/hooks";
import CONFIG from "./config";
import ToastContainer from "./containers/toasts/ToastContainer";
import "@alphaday/ui-kit/global.scss";
import "./customIonicStyles.scss";
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
        <IonTabs>
            <IonRouterOutlet ionPage>
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
            </IonRouterOutlet>
            <IonTabBar
                style={{
                    display: isTabBarHidden ? "none" : "flex",
                }}
                slot="bottom"
            >
                <IonTabButton
                    tab="superfeed"
                    href={EMobileTabRoutePaths.Superfeed}
                >
                    <CustomNavTab label="Superfeed" Icon={SuperfeedSVG} />
                </IonTabButton>
                {IS_DEV && (
                    <IonTabButton
                        tab="market"
                        href={EMobileTabRoutePaths.Market}
                    >
                        <CustomNavTab label="Market" Icon={MarketsSVG} />
                    </IonTabButton>
                )}
                <IonTabButton
                    tab="portfolio"
                    href={EMobileTabRoutePaths.Portfolio}
                    disabled={!IS_DEV}
                >
                    <CustomNavTab
                        label="Portfolio"
                        Icon={PortfolioSVG}
                        disabled={!IS_DEV}
                    />
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

/**
 * TODO: Move user-settings (and any other view that should be accessible from multiple tabs)
 * to a modal.
 * For the MVP it's fine to nest everything within /superfeed
 */
const MobileApp: React.FC = () => {
    return (
        <IonApp className="theme-dark">
            <IonReactRouter>
                <RouterChild />
            </IonReactRouter>
            <ToastContainer
                position="bottom-center"
                duration={CONFIG.UI.TOAST_DURATION}
                className="fontGroup-supportBold"
                containerClassName="last:mb-20"
            />
        </IonApp>
    );
};

export default memo(MobileApp);
