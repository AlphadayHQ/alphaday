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
                        ? "bg-secondaryOrange [&>.modal-header]:bg-secondaryOrange"
                        : "bg-secondaryOrangeSoda [&>.modal-header]:bg-secondaryOrangeSoda"
                )}
            >
                <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                {variant !== "warning" && (
                    <div className="flex justify-center items-center">
                        <b>Oh snaps!</b>
                    </div>
                )}
                <br />
                {children}
                {errorMessage && (
                    <>
                        <br />
                        <br />
                        Error message: {errorMessage}
                    </>
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleCloseModal}>Close</Button>
            </ModalFooter>
        </Modal>
    );
};
