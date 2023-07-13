import { IonDatetime, setupIonicReact } from "@ionic/react";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

setupIonicReact();

function App() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-lg text-red-700">Vite + React + Ionic</h1>
      <IonDatetime className="mt-10"></IonDatetime>
    </div>
  );
}

export default App;
