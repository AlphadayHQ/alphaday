import { IonDatetime, setupIonicReact } from "@ionic/react";
import { AlphaButton } from "./components/buttons/AlphaButton";

setupIonicReact();

function App() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-lg text-primary font-semibold">
        Vite + React + Ionic + Tailwind
      </h1>
      <IonDatetime className="mt-10"></IonDatetime>
      <div className="m-10 p-10 bg-primary">
        <AlphaButton variant="small">
          Primary
        </AlphaButton>
      </div>
    </div>
  );
}

export default App;
