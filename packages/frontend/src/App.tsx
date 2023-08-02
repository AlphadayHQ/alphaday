import { Suspense } from "react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import { routes } from "./routes";
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
const App: React.FC = () => {
    return (
        <IonApp>
            {/** @ts-expect-error react16/18 type conflict */}
            <IonReactRouter>
                <Suspense>
                    <IonRouterOutlet>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                component={route.component}
                            />
                        ))}
                    </IonRouterOutlet>
                </Suspense>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
