import { FC } from "react";
import { useKeyPress } from "src/api/hooks";
import { Logger } from "src/api/utils/logging";
import { ReactComponent as CloseSVG } from "src/assets/icons/close3.svg";
import { AlphaButton, ButtonProps } from "../buttons/AlphaButton";

import {
    StyledModal,
    StyledModalHeader,
    StyledModalTitle,
    StyledModalFooter,
    StyledModalBody,
} from "./AlphaDialog.style";

export interface IModal {
    show: boolean;
    title: string;
    saveButtonText?: string;
    onSave?: () => MaybeAsync<void>;
    disableSave?: boolean;
    closeButtonText?: string;
    onClose: () => void;
    showXButton: boolean;
    size?: "xl" | "lg" | "md" | "sm";
    children?: React.ReactNode;
    buttonProps?: Omit<ButtonProps, "onClick" | "disabled">;
}
export const AlphaDialog: FC<IModal> = ({
    children,
    title,
    onClose,
    onSave,
    disableSave,
    saveButtonText,
    closeButtonText,
    showXButton,
    buttonProps,
    ...restProps
}) => {
    useKeyPress({
        targetKey: "Enter",
        callback: () => {
            onSave?.()?.catch((err) =>
                Logger.error(
                    "AlphaDialog:UsekeyPress::Could not save with Enter key",
                    err
                )
            );
        },
        skip: disableSave,
    });

    const showSaveButton = onSave && saveButtonText;
    const showCloseButton = !!closeButtonText;

    return (
        <StyledModal data-testid="alpha-dialog" {...restProps}>
            <StyledModalHeader>
                <StyledModalTitle>{title}</StyledModalTitle>
                {showXButton && (
                    <button
                        onClick={onClose}
                        className="close"
                        title="close"
                        type="button"
                        data-testid="alpha-dialog-close-button"
                    >
                        <CloseSVG className="icon" />
                    </button>
                )}
            </StyledModalHeader>
            <StyledModalBody>{children}</StyledModalBody>

            {(showSaveButton || showCloseButton) && (
                <StyledModalFooter>
                    {showSaveButton && (
                        <AlphaButton
                            data-testid="alpha-dialog-action-button"
                            extraClassStyles="alphaDialog"
                            onClick={onSave}
                            disabled={disableSave === true}
                            {...buttonProps}
                        >
                            {saveButtonText}
                        </AlphaButton>
                    )}
                    {showCloseButton && (
                        <AlphaButton
                            data-testid="alpha-dialog-close-button"
                            extraClassStyles="alphaDialog"
                            onClick={onClose}
                            {...buttonProps}
                        >
                            {closeButtonText}
                        </AlphaButton>
                    )}
                </StyledModalFooter>
            )}
        </StyledModal>
    );
};
