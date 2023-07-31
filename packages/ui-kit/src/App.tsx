import { IonDatetime, setupIonicReact } from "@ionic/react";
import { Arrow } from "./components/arrow/Arrow";
import { Button } from "./components/buttons/Button";
import { IconButton } from "./components/buttons/IconButton";
import { Z_INDEX_REGISTRY } from "./config/zIndexRegistry";

setupIonicReact();

function App() {
    // TODO Doesn't work like this so add zIndex to utilities just like fonts.
    const p = `z-[${Z_INDEX_REGISTRY.SCROLLBAR}]`;

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <h1 className="text-primary text-lg font-semibold">
                Vite + React + Ionic + Tailwind
            </h1>
            <IonDatetime className="mt-10" />
            <div className="bg-primary m-10 flex flex-col gap-3 p-10">
                <Button variant="small">Primary</Button>
                <div
                    className={`z-[${Z_INDEX_REGISTRY.SCROLLBAR}] bg-secondaryOrange`}
                >
                    <p className=" fontGroup-highlightSemi m-4">
                        Tyring out Prose
                    </p>
                </div>
                <Arrow direction="up" />
                <Arrow direction="down" />

                <IconButton variant="star" />
            </div>
        </div>
    );
}

export default App;
