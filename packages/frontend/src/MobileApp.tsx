import { Suspense, memo } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAppInit, useGlobalHooks } from "./api/hooks";
import { lazyRetry } from "./api/utils/helpers";
import PreloaderPage from "./pages/preloader";
import "@alphaday/ui-kit/global.scss";

const SuperfeedPage = lazyRetry(() => import("./mobile-pages/superfeed"));
const AuthPage = lazyRetry(() => import("./mobile-pages/auth"));

const App: React.FC = () => {
    useAppInit();
    useGlobalHooks();

    return (
        <BrowserRouter>
            <Switch>
                <Suspense fallback={<PreloaderPage />}>
                    <Route path="/" exact component={SuperfeedPage} />
                    <Route path="/auth*" exact component={AuthPage} />
                    {/* Add more routes as needed */}
                </Suspense>
            </Switch>
        </BrowserRouter>
    );
};

export default memo(App);
