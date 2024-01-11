import { useState } from "react";
import { setupIonicReact } from "@ionic/react";
import { Arrow } from "./components/arrow/Arrow";
import { Button } from "./components/buttons/Button";
import { IconButton } from "./components/buttons/IconButton";
import { FormInput } from "./mobile-components/form-elements/FormElements";
import { MobileHeader } from "./mobile-components/navigation/header";
import { MobileBottomNav } from "./mobile-components/navigation/MobileBottomNav";

setupIonicReact();

function App() {
    const [name, setName] = useState("");
    return (
        <>
            <div className="fixed w-full">
                <MobileHeader avatar={undefined} />
            </div>
            <div className="flex h-screen w-screen flex-col items-center justify-center">
                <h1 className="text-primary text-lg font-semibold">
                    Vite + React + Ionic + Tailwind
                </h1>
                {/* <IonDatetime className="mt-10" /> */}
                <div className="m-4">
                    <FormInput
                        value={name}
                        label="Full name"
                        placeholder="Nina Faraggi"
                        defaultValue="test"
                        isOptional
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        errorMsg="This field is required"
                    />
                </div>
                <div className="bg-primary m-10 flex flex-col gap-3 p-10">
                    <Button variant="small">Primary</Button>
                    <div className="bg-secondaryOrange">
                        <p className=" fontGroup-highlightSemi m-4">
                            Tyring out Prose
                        </p>
                    </div>
                    <Arrow direction="up" />
                    <Arrow direction="down" />
                    <IconButton variant="star" />d
                </div>
            </div>
            <MobileBottomNav />
        </>
    );
}

export default App;
