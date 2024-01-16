import { memo } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { useAppInit, useGlobalHooks } from "./api/hooks";

const App: React.FC = () => {
    useAppInit();
    useGlobalHooks();

    return (
        <BrowserRouter>
            <Switch>
                {/* <Route path="/" exact component={HomePage} /> */}
                {/* Add more routes as needed */}
            </Switch>
        </BrowserRouter>
    );
};

export default memo(App);
