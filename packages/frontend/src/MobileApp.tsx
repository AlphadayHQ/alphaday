import { Suspense, memo } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAppInit } from "./api/hooks";
import { lazyRetry } from "./api/utils/helpers";
import PreloaderPage from "./pages/preloader";
import "@alphaday/ui-kit/global.scss";

const SuperfeedPage = lazyRetry(() => import("./mobile-pages/superfeed"));
const AuthPage = lazyRetry(() => import("./mobile-pages/auth"));
const FiltersPage = lazyRetry(() => import("./mobile-pages/filters"));

const MobileApp: React.FC = () => {
    useAppInit();

    return (
        <BrowserRouter>
            <Switch>
                <Suspense fallback={<PreloaderPage />}>
                    <Route path="/" exact component={SuperfeedPage} />
                    <Route path="/auth*" exact component={AuthPage} />
                    <Route path="/filters" exact component={FiltersPage} />
                    {/* Add more routes as needed */}
                </Suspense>
            </Switch>
        </BrowserRouter>
    );
};

export default memo(MobileApp);
