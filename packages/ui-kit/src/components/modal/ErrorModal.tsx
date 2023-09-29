import { FC } from "react";
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
    title: string;
    variant?: "warning" | "error";
    errorMessage?: string | null;
    onClose: () => void;
    size?: "xl" | "lg" | "md" | "sm";
    children?: React.ReactNode;
}
export const ErrorModal: FC<IModal> = ({
    children,
    title,
    errorMessage,
    onClose,
    variant,
    ...restProps
}) => {
    return (
        <Modal className="z-[10000]" showModal onClose={onClose} {...restProps}>
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
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
        </Modal>
    );
};
