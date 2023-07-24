import { IonDatetime, setupIonicReact } from "@ionic/react";
import { AlphaButton } from "./components/buttons/AlphaButton";
import { AlphaIconButton } from "./components/buttons/AlphaIconButton";
import { AlphaArrow } from "./components/arrow/AlphaArrow";

setupIonicReact();

function App() {
  return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
          <h1 className="text-primary text-lg font-semibold">
              Vite + React + Ionic + Tailwind
          </h1>
          <IonDatetime className="mt-10"></IonDatetime>
          <div className="bg-primary m-10 flex flex-col gap-3 p-10">
              <AlphaButton variant="small">Primary</AlphaButton>
              <div className="">
                  <p className="contentXXXX m-4">Tyring out Prose</p>
              </div>
              <AlphaArrow direction="up" />
              <AlphaArrow direction="down" />

              <AlphaIconButton variant="star" />
          </div>
      </div>
  );
}

export default App;
