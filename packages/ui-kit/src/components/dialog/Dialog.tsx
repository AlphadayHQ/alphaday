import { FC, useRef } from "react";
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
    showDialog?: boolean;
    buttonProps?: Omit<ButtonProps, "onClick" | "disabled">;
}

export const Dialog: FC<IDialog> = ({
    children,
    title,
    onClose,
    onSave,
    disableSave,
    saveButtonText,
    closeButtonText,
    showXButton,
    buttonProps,
    showDialog,
    size,
    ...restProps
}) => {
    const modalRef = useRef<HTMLIonModalElement>(null);

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
            showModal={showDialog}
            size={size}
            data-testid="alpha-dialog"
            onClose={onClose}
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
