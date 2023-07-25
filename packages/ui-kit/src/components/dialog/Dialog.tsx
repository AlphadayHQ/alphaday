import { FC, useRef } from "react";
// TODO: Add useKeyPress hook and Logger
// import { useKeyPress } from "src/api/hooks";
// import { Logger } from "src/api/utils/logging";
import { ReactComponent as CloseSVG } from "src/assets/svg/close3.svg";
import { Button, ButtonProps } from "../buttons/Button";
import { Modal } from "../modal/Modal";

export interface IDialog {
    title: string;
    saveButtonText?: string;
    onSave?: () => MaybeAsync<void>;
    disableSave?: boolean;
    closeButtonText?: string;
    onClose: () => void;
    showXButton: boolean;
    size?: "xl" | "lg" | "md" | "sm";
    children?: React.ReactNode;
    triggerId: string;
    showDialog?: boolean;
    buttonProps?: Omit<ButtonProps, "onClick" | "disabled">;
}

export const Dialog: FC<
    RequireAtLeastOne<IDialog, "triggerId" | "showDialog">
> = ({
    children,
    title,
    onClose,
    onSave,
    disableSave,
    saveButtonText,
    closeButtonText,
    showXButton,
    buttonProps,
    triggerId,
    showDialog,
    ...restProps
}) => {
    const modalRef = useRef<HTMLIonModalElement>(null);

    // useKeyPress({
    //     targetKey: "Enter",
    //     callback: () => {
    //         onSave?.()?.catch((err) =>
    //             Logger.error(
    //                 "Dialog:UsekeyPress::Could not save with Enter key",
    //                 err
    //             )
    //         );
    //     },
    //     skip: disableSave,
    // });

    const handleCloseDialog = () => {
        onClose();
        modalRef.current?.dismiss();
    };
    const handleSaveDialog = () => {
        onSave?.();
        modalRef.current?.dismiss();
    };

    const showSaveButton = onSave && saveButtonText;
    const showCloseButton = !!closeButtonText;

    return (
        <Modal
            triggerId={triggerId || "default-dialog-trigger"}
            showModal={showDialog}
            ref={modalRef}
            data-testid="alpha-dialog"
            {...restProps}
        >
            <div className="border-0 p-[15px]">
                <h6 className="text-primary self-center text-base font-normal leading-6">
                    {title}
                </h6>
                {showXButton && (
                    <button
                        onClick={handleCloseDialog}
                        className="border-primaryVariant200 bg-backgroundVariant200 flex h-[34px] w-[34px] items-center justify-center rounded-[50%] border-[1.5px] border-solid"
                        title="close"
                        type="button"
                        data-testid="alpha-dialog-close-button"
                    >
                        <CloseSVG className="h-[8.4px] w-[8.4px]" />
                    </button>
                )}
            </div>
            <div className="flex p-[15px]">{children}</div>

            {(showSaveButton || showCloseButton) && (
                <div className="flex justify-center border-0 pb-[15px]">
                    {showSaveButton && (
                        <Button
                            data-testid="alpha-dialog-action-button"
                            extraClassStyles="alphaDialog"
                            onClick={handleSaveDialog}
                            disabled={disableSave === true}
                            {...buttonProps}
                        >
                            {saveButtonText}
                        </Button>
                    )}
                    {showCloseButton && (
                        <Button
                            data-testid="alpha-dialog-close-button"
                            extraClassStyles="alphaDialog"
                            onClick={handleCloseDialog}
                            {...buttonProps}
                        >
                            {closeButtonText}
                        </Button>
                    )}
                </div>
            )}
        </Modal>
    );
};
