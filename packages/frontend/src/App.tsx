import { Suspense } from "react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Web3Modal } from "@web3modal/react";
import { Route } from "react-router-dom";
import walletConnectProvider from "./api/store/providers/wallet-connect-provider";
import CONFIG from "./config/config";
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
        <IonApp className="theme-dark">
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
        </IonApp>
    );
};

export default App;
