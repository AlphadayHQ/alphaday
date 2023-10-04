import { Suspense, useMemo } from "react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Route } from "react-router-dom";
import * as userStore from "src/api/store/slices/user";
import { useResolvedView } from "./api/hooks";
import { useGetRemoteStatusQuery } from "./api/services";
import { useAppDispatch } from "./api/store/hooks";
import { getRtkErrorCode } from "./api/utils/errorHandling";
import { appRoutes, loadRoutes, errorRoutes } from "./routes";
import "@alphaday/ui-kit/global.scss";

/**
 * The comments below are for notes and should be removed as this app grows.
 *
 * Ideally, this app should have truly dynamic routes which react-router-v6 gives us.
 * However, Ionic's IonRouterOutlet does not support react-router-v6 yet.
 * As a result, I'm proposing a hybrid approach where we use react-router-v5 to handle routing
 * But leverage react's in-built features to handle the dynamicity. This would be done by using a unique key
 * to depose the route and switch to a new one. This is not ideal but it's a workaround for now.
 *
 * It is yet to be implemented.
 */
const AppRoutes = () => {
    const dispatch = useAppDispatch();
    const { error } = useGetRemoteStatusQuery(undefined, {
        pollingInterval: 5 * 60 * 1000, // update every 5 min
        refetchOnMountOrArgChange: true,
    });

    const resolvedView = useResolvedView();

    const routes = useMemo(() => {
        if (resolvedView.isLoading) {
            return loadRoutes;
        }
        if (error || resolvedView.isError) {
            const errorInfo = error ?? resolvedView.error;
            const errorType = getRtkErrorCode(errorInfo);
            return errorRoutes.map((route) => ({
                ...route,
                component: () => (
                    <route.component key="error" type={errorType} />
                ),
            }));
        }
        return appRoutes;
    }, [resolvedView, error]);

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
