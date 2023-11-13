import { FC, useRef } from "react";
// TODO (xavier-charles):: Add useKeyPress hook and Logger
// import { useKeyPress } from "src/api/hooks";
// import { Logger } from "src/api/utils/logging";
import { ReactComponent as CloseSVG } from "../../assets/svg/close3.svg";
import { Button, ButtonProps } from "../buttons/Button";
import { Modal } from "../modal/Modal";

export interface IDialog {
    title?: string;
    saveButtonText?: string;
    onSave?: () => MaybeAsync<void>;
    disableSave?: boolean;
    closeButtonText?: string;
    onClose?: () => void;
    showXButton: boolean;
    size?: "xl" | "lg" | "md" | "sm";
    children?: React.ReactNode;
    triggerId: string;
    showDialog?: boolean;
    darkerBackdrop?: boolean;
    className?: string;
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
    darkerBackdrop,
    size,
    className,
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

    const handleCloseDialog = async () => {
        onClose?.();
        await modalRef.current?.dismiss();
    };
    const handleSaveDialog = async () => {
        await onSave?.();
        await modalRef.current?.dismiss();
    };

    const showSaveButton = onSave && saveButtonText;
    const showCloseButton = !!closeButtonText;

    return (
        <Modal
            triggerId={triggerId || "default-dialog-trigger"}
            showModal={showDialog}
            ref={modalRef}
            size={size}
            darkerBackdrop={darkerBackdrop}
            data-testid="alpha-dialog"
            onClose={onClose}
            className={className}
            {...restProps}
        >
            <div className="flex justify-between items-center border-0 p-[15px]">
                <h6 className="text-primary self-center leading-6 fontGroup-highlightSemi !text-sm m-0">
                    {title}
                </h6>
                {showXButton && (
                    <button
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={handleCloseDialog}
                        className="border-primaryVariant200 bg-backgroundVariant200 flex h-[34px] w-[34px] items-center justify-center rounded-[50%] border-[1.5px] border-solid"
                        title="close"
                        type="button"
                        data-testid="alpha-dialog-close-button"
                    >
                        <CloseSVG className="h-[8.4px] w-[8.4px] text-primary" />
                    </button>
                )}
            </div>
            <div className="flex p-[15px]">{children}</div>

            {(showSaveButton || showCloseButton) && (
                <div className="flex justify-center border-0 pb-[15px]">
                    {showSaveButton && (
                        <Button
                            data-testid="alpha-dialog-action-button"
                            onClick={handleSaveDialog}
                            disabled={disableSave === true}
                            className="py-3 px-12 my-3"
                            {...buttonProps}
                        >
                            {saveButtonText}
                        </Button>
                    )}
                    {showCloseButton && (
                        <Button
                            data-testid="alpha-dialog-close-button"
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
