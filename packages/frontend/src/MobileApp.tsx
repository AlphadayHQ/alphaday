import { memo } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAppInit, useGlobalHooks } from "./api/hooks";
import SuperfeedPage from "./mobile-pages/superfeed";

const App: React.FC = () => {
    useAppInit();
    useGlobalHooks();

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={SuperfeedPage} />
                {/* Add more routes as needed */}
            </Switch>
        </BrowserRouter>
    );
};

export default memo(App);
