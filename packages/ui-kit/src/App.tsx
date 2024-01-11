import { IonDatetime, setupIonicReact } from "@ionic/react";
import { Arrow } from "./components/arrow/Arrow";
import { Button } from "./components/buttons/Button";
import { IconButton } from "./components/buttons/IconButton";
import { MobileHeader } from "./mobile-components/navigation/header";

setupIonicReact();

function App() {
    return (
        <>
            <div className="fixed w-full">
                <MobileHeader avatar={undefined} />
            </div>
            <div className="flex h-screen w-screen flex-col items-center justify-center">
                <h1 className="text-primary text-lg font-semibold">
                    Vite + React + Ionic + Tailwind
                </h1>
                <IonDatetime className="mt-10" />
                <div className="bg-primary m-10 flex flex-col gap-3 p-10">
                    <Button variant="small">Primary</Button>
                    <div className="bg-secondaryOrange">
                        <p className=" fontGroup-highlightSemi m-4">
                            Tyring out Prose
                        </p>
                    </div>
                    <Arrow direction="up" />
                    <Arrow direction="down" />

                    <IconButton variant="star" />
                </div>
            </div>
        </>
    );
}

export default App;
