import { FC } from "react";
import { ModalBody, ModalFooter } from "@alphaday/components";
import { AlphaButton } from "../buttons/AlphaButton";
import {
    StyledModal,
    StyledModalHeader,
    StyledModalTitle,
    StyledCenteredBlock,
} from "./AlphaErrorModal.style";

interface IModal {
    show: boolean;
    title: string;
    variant?: "warning" | "error";
    errorMessage?: string | null;
    onClose: () => void;
    size?: "xl" | "lg" | "md" | "sm";
    children?: React.ReactNode;
}
export const AlphaErrorModal: FC<IModal> = ({
    children,
    title,
    errorMessage,
    onClose,
    variant,
    ...restProps
}) => {
    return (
        <StyledModal {...restProps}>
            <StyledModalHeader variant={variant}>
                <StyledModalTitle>{title}</StyledModalTitle>
            </StyledModalHeader>
            <ModalBody>
                {variant !== "warning" && (
                    <StyledCenteredBlock>
                        <b>Oh snaps!</b>
                    </StyledCenteredBlock>
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
                <AlphaButton onClick={onClose}>Close</AlphaButton>
            </ModalFooter>
        </StyledModal>
    );
};
