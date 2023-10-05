import { Suspense, useMemo } from "react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Route } from "react-router-dom";
import * as userStore from "src/api/store/slices/user";
import { useResolvedView, useViewRoute } from "./api/hooks";
import { useGetRemoteStatusQuery } from "./api/services";
import { useAppDispatch } from "./api/store/hooks";
import { getRtkErrorCode } from "./api/utils/errorHandling";
import { appRoutes, loadRoutes, errorRoutes } from "./routes";
import "@alphaday/ui-kit/global.scss";

const AppRoutes = () => {
    const dispatch = useAppDispatch();
    const { error } = useGetRemoteStatusQuery(undefined, {
        pollingInterval: 5 * 60 * 1000, // update every 5 min
        refetchOnMountOrArgChange: true,
    });

    const resolvedView = useResolvedView();
    const { pathContainsHashOrSlug } = useViewRoute();

    const routes = useMemo(() => {
        if (resolvedView.isLoading) {
            return loadRoutes;
        }
        if (!pathContainsHashOrSlug && !resolvedView.currentData) {
            return errorRoutes;
        }
        if (error || resolvedView.isError) {
            const errorInfo = error ?? resolvedView.error;
            const errorType = getRtkErrorCode(errorInfo);
            return errorRoutes.map((route) => ({
                ...route,
                component: () => <route.component type={errorType} />,
            }));
        }
        return appRoutes;
    }, [resolvedView, error, pathContainsHashOrSlug]);

    /**
     * If the status check gives a 401 unauthorized error,
     * we need to reset the auth state and reload the app
     */
    if ((error as FetchBaseQueryError)?.status === 401) {
        dispatch(userStore.resetAuthState());
        location.reload();
    }

    return routes.map((route) => (
        <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            component={route.component}
        />
    ));
};

const App: React.FC = () => {
    return (
        <IonApp className="theme-dark">
            <IonReactRouter>
                <Suspense>
                    <IonRouterOutlet>
                        <AppRoutes />
                    </IonRouterOutlet>
                </Suspense>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
