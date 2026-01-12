import { FC } from "react";
import { ReactComponent as CloseSVG } from "../../assets/svg/close3.svg";
import { Button, ButtonProps } from "../buttons/Button";
import { Modal } from "../modal/Modal";

export interface IKeyPress {
    targetKey: string;
    callback: () => void;
    skip?: boolean;
}
export interface IDialog {
    title?: string;
    saveButtonText?: string;
    onSave?: () => MaybeAsync<void>;
    disableSave?: boolean;
    closeButtonText?: string;
    onClose?: () => void;
    showXButton: boolean;
    size?: "xl" | "lg" | "md" | "sm" | "xs";
    children?: React.ReactNode;
    showDialog?: boolean;
    closeButtonProps?: Omit<ButtonProps, "onClick" | "disabled">;
    buttonProps?: Omit<ButtonProps, "onClick" | "disabled">;
    useKeyPress?: (args: IKeyPress) => void;
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
    useKeyPress,
    closeButtonProps,
    ...restProps
}) => {
    const handleCloseDialog = () => {
        onClose?.();
    };
    const handleSaveDialog = async () => {
        await onSave?.();
    };

    const showSaveButton = onSave && saveButtonText;
    const showCloseButton = !!closeButtonText;

    useKeyPress?.({
        targetKey: "Enter",
        callback: () => {
            onSave?.()?.catch(() => {});
        },
        skip: !showSaveButton || disableSave,
    });

    return (
        <Modal
            showModal={showDialog}
            size={size}
            data-testid="alpha-dialog"
            onClose={onClose}
            {...restProps}
        >
            <div className="flex justify-between items-center border-0 p-4">
                <h6 className="text-primary self-center leading-6 fontGroup-highlightSemi !text-sm m-0">
                    {title}
                </h6>
                {showXButton && (
                    <button
                        onClick={handleCloseDialog}
                        title="close"
                        type="button"
                        data-testid="alpha-dialog-close-button"
                        className="border-borderLine bg-background flex h-[34px] w-[34px] items-center justify-center rounded-[50%] border-2 border-solid"
                        {...closeButtonProps}
                    >
                        <CloseSVG className="h-[8.4px] w-[8.4px] text-borderLine outline-none" />
                    </button>
                )}
            </div>
            <div className="flex p-4">{children}</div>

            {(showSaveButton || showCloseButton) && (
                <div className="flex justify-center border-0 pb-4">
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
