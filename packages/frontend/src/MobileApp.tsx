import { Suspense, memo } from "react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { useAppInit, useAuth } from "./api/hooks";
import { lazyRetry } from "./api/utils/helpers";
import PreloaderPage from "./pages/preloader";
import "@alphaday/ui-kit/global.scss";

const SuperfeedPage = lazyRetry(() => import("./mobile-pages/superfeed"));
const AuthPage = lazyRetry(() => import("./mobile-pages/auth"));
const FiltersPage = lazyRetry(() => import("./mobile-pages/filters"));
const NotificationsPage = lazyRetry(
    () => import("./mobile-pages/notifications")
);
const UserSettingsPage = lazyRetry(
    () => import("./mobile-pages/user-settings")
);

const MobileApp: React.FC = () => {
    useAppInit();

    const { isAuthenticated } = useAuth();

    return (
        <IonApp className="theme-dark">
            <IonReactRouter>
                <IonRouterOutlet>
                    <Suspense fallback={<PreloaderPage />}>
                        <Route path="/" exact component={SuperfeedPage} />
                        <Route path="/auth*" exact component={AuthPage} />
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
                        />
                        <Route render={() => <Redirect to="/" />} />
                    </Suspense>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default memo(MobileApp);
