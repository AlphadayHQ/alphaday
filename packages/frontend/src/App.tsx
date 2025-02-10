import { Suspense, memo, useMemo } from "react";
import { ErrorModal } from "@alphaday/ui-kit";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Web3Modal } from "@web3modal/react";
import { Redirect, Route } from "react-router-dom";
import * as userStore from "src/api/store/slices/user";
import ToastContainer from "src/containers/toasts/ToastContainer";
import {
    useAppInit,
    useResolvedView,
    useViewRoute,
    useGaTracker,
} from "./api/hooks";
import { useGetRemoteStatusQuery } from "./api/services";
import { useAppDispatch } from "./api/store/hooks";
import walletConnectProvider from "./api/store/providers/wallet-connect-provider";
import { isCookieEnabled } from "./api/utils/cookie";
import { getRtkErrorCode } from "./api/utils/errorHandling";
import { Logger } from "./api/utils/logging";
import CONFIG from "./config/config";
import PreloaderPage from "./pages/preloader";
import { EDesktopRoutePaths, desktopRoutes, errorRoutes } from "./routes";
import "@alphaday/ui-kit/global.scss";

const landingPage = CONFIG.SEO.DOMAIN;

const goToLandingPage = () => {
    window.location.href = landingPage;
};

const AppRoutes = () => {
    useGaTracker();

    const dispatch = useAppDispatch();
    const { error } = useGetRemoteStatusQuery(undefined, {
        pollingInterval: 5 * 60 * 1000, // update every 5 min
        refetchOnMountOrArgChange: true,
    });

    const resolvedView = useResolvedView();
    const { pathContainsHashOrSlug, isRoot, isSuperfeed } = useViewRoute();

    const errorCode = useMemo<number | undefined>(() => {
        /**
         * At this moment, we do not support any other routes than the root and the hash/slug routes
         * If the path does not contain a hash or slug, we show the 404 error page
         */
        if (!pathContainsHashOrSlug && !isRoot && !isSuperfeed) {
            return 404;
        }
        const errorInfo = error ?? resolvedView.error;
        return errorInfo && getRtkErrorCode(errorInfo);
    }, [
        pathContainsHashOrSlug,
        isRoot,
        isSuperfeed,
        error,
        resolvedView.error,
    ]);

    const routes = useMemo(() => {
        if (error || errorCode) {
            return errorRoutes;
        }
        return desktopRoutes;
    }, [error, errorCode]);

    /**
     * If the status check or the subscribed views endpoint gives a 401 unauthorized error,
     * we need to reset the auth state and reload the app
     */
    if (errorCode === 401) {
        Logger.debug("App::AppRoutes: 401 received");
        dispatch(userStore.resetAuthState());
        location.reload();
    }

    if (isSuperfeed) {
        return (
            <Redirect
                key={EDesktopRoutePaths.Superfeed}
                path={EDesktopRoutePaths.Superfeed}
                exact
                to={EDesktopRoutePaths.Base}
                push
            />
        );
    }

    return (
        <Suspense fallback={<PreloaderPage />}>
            {routes.map((route) => {
                if (route.type === "redirect") {
                    return null;
                }
                return (
                    <Route
                        key={route.path}
                        path={route.path}
                        exact={route.exact}
                        render={() => (
                            <route.component
                                isFullsize={route.isFullsize}
                                type={errorCode}
                            />
                        )}
                    />
                );
            })}
        </Suspense>
    );
};

const App: React.FC = () => {
    useAppInit();

    if (!isCookieEnabled()) {
        return (
            <IonApp className="theme-dark">
                <ErrorModal
                    title="Cookie Error"
                    onClose={goToLandingPage}
                    errorMessage="Cookies must be enabled to use Alphaday."
                    size="sm"
                />
            </IonApp>
        );
    }

    return (
        <IonApp className="theme-dark">
            <IonReactRouter>
                <IonRouterOutlet>
                    <AppRoutes />
                </IonRouterOutlet>
            </IonReactRouter>
            <Web3Modal
                projectId={CONFIG.WALLET_CONNECT.PROJECT_ID}
                ethereumClient={walletConnectProvider}
                themeMode="dark"
                themeVariables={{
                    "--w3m-background-color":
                        "var(--colors-background-variant200, var(--alpha-dark-300))",
                    "--w3m-accent-color":
                        "var(--colors-btn-ring-variant100, var(--alpha-dark-300))",
                    "--w3m-overlay-background-color":
                        "var(--colors-background-variant1600, var(--alpha-dark-300))",
                }}
            />
            <ToastContainer
                duration={CONFIG.UI.TOAST_DURATION}
                className="fontGroup-supportBold"
            />
        </IonApp>
    );
};

export default memo(App);
