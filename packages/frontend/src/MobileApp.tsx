import { Suspense, memo } from "react";
import {
    IonApp,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { ReactComponent as MarketsSVG } from "src/assets/svg/markets.svg";
import { ReactComponent as PortfolioSVG } from "src/assets/svg/portfolio.svg";
import { ReactComponent as SuperfeedSVG } from "src/assets/svg/superfeed.svg";
import { useAuth } from "./api/hooks";
import { useGetFeaturesQuery } from "./api/services";
import { lazyRetry } from "./api/utils/helpers";
import InstallPWAContainer from "./containers/dialogs/InstallPWAContainer";
import PreloaderPage from "./pages/preloader";
import "@alphaday/ui-kit/global.scss";
import "./customIonicStyles.scss";

const SuperfeedPage = lazyRetry(() => import("./mobile-pages/superfeed"));
const Placeholder = lazyRetry(() => import("./mobile-pages/placeholder"));
const AuthPage = lazyRetry(() => import("./mobile-pages/auth"));
const ExternalPage = lazyRetry(() => import("./mobile-pages/external"));
const NotificationsPage = lazyRetry(
    () => import("./mobile-pages/notifications")
);
const UserSettingsPage = lazyRetry(
    () => import("./mobile-pages/user-settings")
);

const CustomNavTab: React.FC<{
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}> = ({ label, Icon }) => (
    <div className="inline-flex flex-col items-center justify-center py-3 px-2">
        <span className="rounded-2xl relative">
            <Icon />
        </span>
        <span className="capitalize mt-1 fontGroup-highlightSemi">{label}</span>
    </div>
);

/**
 * TODO: Move user-settings (and any other view that should be accessible from multiple tabs)
 * to a modal.
 * For the MVP it's fine to nest everything within /superfeed
 */
const TabNavigator: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/superfeed">
                    <SuperfeedPage />
                </Route>
                <Route exact path="/superfeed/external">
                    <ExternalPage />
                </Route>
                <Route exact path="/superfeed/user-settings">
                    <UserSettingsPage />
                </Route>
                <Route exact path="/superfeed/auth">
                    <AuthPage />
                </Route>
                <Route exact path="/superfeed/search/:tags">
                    <SuperfeedPage />
                </Route>
                <Route
                    exact
                    path="/superfeed/notifications"
                    render={() => {
                        return isAuthenticated ? (
                            <NotificationsPage />
                        ) : (
                            <SuperfeedPage />
                        );
                    }}
                />
                <Route exact path="/market">
                    <Placeholder />
                </Route>
                <Route exact path="/portfolio">
                    <Placeholder />
                </Route>
                <Route exact path="/auth*">
                    <AuthPage />
                </Route>
                <Route exact path="/">
                    <Redirect to="/superfeed" />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="superfeed" href="/superfeed">
                    <CustomNavTab label="Superfeed" Icon={SuperfeedSVG} />
                </IonTabButton>
                <IonTabButton tab="market" href="/market">
                    <CustomNavTab label="Market" Icon={MarketsSVG} />
                </IonTabButton>
                <IonTabButton tab="portfolio" href="/portfolio">
                    <CustomNavTab label="Portfolio" Icon={PortfolioSVG} />
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

const MobileApp: React.FC = () => {
    useGetFeaturesQuery();

    return (
        <IonApp className="theme-dark">
            <InstallPWAContainer />
            <IonReactRouter>
                <IonRouterOutlet>
                    <Suspense fallback={<PreloaderPage />}>
                        <Route path="/" render={() => <TabNavigator />} />
                    </Suspense>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default memo(MobileApp);
