import { useState } from "react";
import { Dialog } from "./Dialog";

export default {
    title: "Widgets/Dialog",
    component: Dialog,
    argTypes: {},
};

const Template = () => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen((isOpen) => !isOpen);
    return (
        <>
            <Dialog
                show={open}
                title="Test"
                saveButtonText="Close"
                onClose={toggleOpen}
                showXButton
            >
                Test Dialog
            </Dialog>
        </>
    );
};

export const Sample = Template.bind({});
