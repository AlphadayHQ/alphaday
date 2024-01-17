import { useState } from "react";
import { setupIonicReact } from "@ionic/react";
import { Arrow } from "./components/arrow/Arrow";
import { Button } from "./components/buttons/Button";
import { IconButton } from "./components/buttons/IconButton";
import {
    FormCheckbox,
    FormInput,
    FormRadio,
    FormSelect,
    FormTextArea,
} from "./mobile-components/form-elements/FormElements";
import { MobileHeader } from "./mobile-components/navigation/header";
import { MobileBottomNav } from "./mobile-components/navigation/MobileBottomNav";

setupIonicReact();

function App() {
    const [name, setName] = useState("");
    const [checked, setChecked] = useState(false);
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
                <div className="max-w-md w-full">
                    <div className="m-1">
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
                    <div className="m-1 mt-4">
                        <FormTextArea
                            value={name}
                            label="A little about yourself"
                            placeholder="I am a software engineer who loves to code and build things."
                            defaultValue="test"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="m-1 mt-4">
                        <FormSelect
                            selected={{
                                id: name.toString(),
                                value: name.toString(),
                            }}
                            label="A little about yourself"
                            placeholder="I am a software engineer who loves to code and build things."
                            onChange={(e) => setName(e.value)}
                            options={[
                                { id: "1000", value: "1000" },
                                { id: "1000", value: "20000" },
                                { id: "1000", value: "3erty" },
                            ]}
                            defaultValue={{ id: "1", value: "1000" }}
                        />
                    </div>
                    <div className="m-1 mt-4">
                        <FormCheckbox
                            checked={checked}
                            onChange={() => setChecked((prev) => !prev)}
                            label="I agree to the terms and conditions"
                            subtext="By checking this box, you agree to the terms and conditions of this website."
                        />
                    </div>
                    <div className="m-1 mt-4">
                        <FormRadio
                            checked={checked}
                            onChange={() => setChecked((prev) => !prev)}
                            label="I agree to the terms and conditions"
                            subtext="By checking this box, you agree to the terms and conditions of this website."
                        />
                    </div>
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
