import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

const App: React.FunctionComponent = () => {
  return (
    <IonApp>
      <div className="App">
        <header />
        <IonReactRouter>
          <Suspense>
            <Switch>
              <Route />
            </Switch>
          </Suspense>
        </IonReactRouter>
      </div>
    </IonApp>
  );
};

export default App;
