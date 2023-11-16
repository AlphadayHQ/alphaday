import { FC, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../buttons/Button";
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "./Modal";

interface IModal {
    title?: string;
    variant?: "warning" | "error";
    errorMessage?: string | null;
    onClose?: () => void;
    size?: "xl" | "lg" | "md" | "sm";
    children?: React.ReactNode;
    isHidden?: boolean;
}
export const ErrorModal: FC<IModal> = ({
    children,
    title,
    errorMessage,
    onClose,
    variant,
    isHidden,
    ...restProps
}) => {
    const modalRef = useRef<HTMLIonModalElement>(null);
    const handleCloseModal = async () => {
        onClose?.();
        await modalRef.current?.dismiss();
    };
    return (
        <Modal showModal={!isHidden} onClose={onClose} {...restProps}>
            <ModalHeader
                className={twMerge(
                    variant === "warning"
                        ? "bg-secondaryOrange"
                        : "bg-secondaryOrangeSoda"
                )}
            >
                <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                {variant !== "warning" && (
                    <div className="flex justify-center items-center mt-4">
                        <p className="fontGroup-highlight">Oh snaps!</p>
                    </div>
                )}
                <br />
                {children}
                {errorMessage && (
                    <>
                        <br />
                        Error message: {errorMessage}
                    </>
                )}
            </ModalBody>
            <ModalFooter>
                <Button className="pt-1.5" onClick={handleCloseModal}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};
