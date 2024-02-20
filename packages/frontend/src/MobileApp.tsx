import { Suspense, memo } from "react";
import { themeColors } from "@alphaday/ui-kit";
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
import { ReactComponent as SuperfeedSVG } from "src/assets/svg/superfeed.svg";
import { useAppInit, useAuth } from "./api/hooks";
import { lazyRetry } from "./api/utils/helpers";
import PreloaderPage from "./pages/preloader";
import "@alphaday/ui-kit/global.scss";
import "./customIonicStyles.scss";

const SuperfeedPage = lazyRetry(() => import("./mobile-pages/superfeed"));
const AuthPage = lazyRetry(() => import("./mobile-pages/auth"));
const FiltersPage = lazyRetry(() => import("./mobile-pages/filters"));
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

const TabNavigator: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route path="/superfeed">
                    <SuperfeedPage />
                </Route>
                <Route exact path="/auth*">
                    <AuthPage />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="superfeed" href="/superfeed">
                    <CustomNavTab label="Superfeed" Icon={SuperfeedSVG} />
                </IonTabButton>
                <IonTabButton tab="market" href="/market">
                    <CustomNavTab label="Market" Icon={MarketsSVG} />
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

const MobileApp: React.FC = () => {
    useAppInit();

    // const { isAuthenticated } = useAuth();

    return (
        <IonApp className="theme-dark">
            <IonReactRouter>
                <IonRouterOutlet>
                    <Suspense fallback={<PreloaderPage />}>
                        <Route path="/" render={() => <TabNavigator />} />
                        {/* <Route path="/auth*" exact component={AuthPage} />
                        <Route path="/filters" exact component={FiltersPage} />
                        <Route
                            path="/user-settings"
                            exact
                            component={UserSettingsPage}
                        />
                        <Route
                            path="/notifications"
                            exact
                            render={() =>
                                isAuthenticated ? (
                                    <NotificationsPage />
                                ) : (
                                    <SuperfeedPage />
                                )
                            }
                        /> */}
                    </Suspense>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default memo(MobileApp);
