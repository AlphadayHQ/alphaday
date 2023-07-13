import { IonDatetime, setupIonicReact } from "@ionic/react";

setupIonicReact();

function App() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-lg text-red-700 font-semibold">Vite + React + Ionic</h1>
      <IonDatetime className="mt-10"></IonDatetime>
    </div>
  );
}

export default App;
