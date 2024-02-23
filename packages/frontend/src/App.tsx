import { Suspense, memo, useMemo } from "react";
import { ErrorModal } from "@alphaday/ui-kit";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Web3Modal } from "@web3modal/react";
import { Route } from "react-router-dom";
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
import { appRoutes, errorRoutes } from "./routes";
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
    const { pathContainsHashOrSlug, isRoot } = useViewRoute();

    const errorCode = useMemo<number | undefined>(() => {
        /**
         * At this moment, we do not support any other routes than the root and the hash/slug routes
         * If the path does not contain a hash or slug, we show the 404 error page
         */
        if (!pathContainsHashOrSlug && !isRoot) {
            return 404;
        }
        const errorInfo = error ?? resolvedView.error;
        return errorInfo && getRtkErrorCode(errorInfo);
    }, [error, resolvedView.error, pathContainsHashOrSlug, isRoot]);

    const routes = useMemo(() => {
        if (error || errorCode) {
            return errorRoutes;
        }
        return appRoutes;
    }, [error, errorCode]);

    /**
     * If the status check gives a 401 unauthorized error,
     * we need to reset the auth state and reload the app
     */
    if ((error as FetchBaseQueryError)?.status === 401) {
        Logger.debug("App::AppRoutes: 401 received");
        dispatch(userStore.resetAuthState());
        location.reload();
    }

    return (
        <Suspense fallback={<PreloaderPage />}>
            {routes.map((route) => (
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
            ))}
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
