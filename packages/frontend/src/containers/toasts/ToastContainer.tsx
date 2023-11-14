import { FC } from "react";
import { ToastOptions, useToaster } from "react-hot-toast";
import ToastWrapper from "src/components/toasts/ToastWrapper";

interface IToastContainer {
    options: ToastOptions;
}

const ToastContainer: FC<IToastContainer> = ({ options }) => {
    const { toasts, handlers } = useToaster(options);
    return (
        <ToastWrapper toasts={toasts} handlers={handlers} options={options} />
    );
};

export default ToastContainer;
