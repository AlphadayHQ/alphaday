import { FC, forwardRef } from "react";
import { IonModal, IonBackdrop } from "@ionic/react";
import { twMerge } from "tailwind-merge";

export interface IProps {
    /**
     * Pass extra classes
     */
    className?: string;
    children?: React.ReactNode;
}

export interface IModal extends IProps {
    /**
     * Is the modal open
     * @default false
     */
    showModal?: boolean;
    /**
     * Id of element to trigger the modal to open.
     */
    triggerId?: string;
    /**
     * Modal Sizes
     */
    size?: "xl" | "lg" | "md" | "sm";
    /**
     * Callback function for close modal
     */
    onClose?: () => void;
    /**
     * Hide modal backdrop when modal is open.
     */
    hideBackdrop?: boolean;
}
/**
 * This is a modal component uses the triggerId to open the modal.
 * when an element with the triggerId is clicked, the modal will open.
 *
 * Ionic's isOpen: boolean can also be used to open the modal. However it uses a
 * one-way data binding, so it will not update it's value when the modal closes.
 * https://ionicframework.com/docs/api/modal#using-isopen
 *
 * IonBackdrop enables the click outside to close functionality.
 */

export const Modal = forwardRef<
    HTMLIonModalElement | null,
    RequireAtLeastOne<IModal, "triggerId" | "showModal">
>(
    (
        {
            className,
            children,
            onClose,
            triggerId,
            showModal,
            hideBackdrop,
            size,
        },
        ref
    ) => {
        const maxWidth = {
            xl: "1050px",
            lg: "800px",
            md: "650px",
            sm: "450px",
        }[size || "xl"];

        return (
            <IonModal
                ref={ref}
                trigger={triggerId}
                isOpen={showModal}
                onWillDismiss={() => onClose?.()} // for ion-modal esc key and backdrop click
                className={twMerge(
                    "bg-backgroundVariant1300 h-screen [&_.ion-delegate-host]:h-screen outline-none relative",
                    className
                )}
            >
                <div
                    style={{
                        boxShadow: "0px 0px 0px 1px rgba(121, 131, 162, 0.2)",
                        maxWidth: `min(calc(100% - 20px), ${maxWidth})`,
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-backgroundVariant200 text-primary border-2 border-solid border-background rounded-[5px] w-full"
                >
                    {children}
                </div>
                {!hideBackdrop && (
                    <IonBackdrop className="h-full w-full absolute z-[-1]" />
                )}
            </IonModal>
        );
    }
);

export const ModalHeader: FC<IProps> = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <div
            className={twMerge(
                "flex items-start justify-between rounded-t-[calc(0.3rem-1px)] p-4",
                className
            )}
            {...restProps}
        >
            {children}
        </div>
    );
};

export const ModalTitle: FC<IProps> = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <h6 className={twMerge(className, "mb-0 leading-6")} {...restProps}>
            {children}
        </h6>
    );
};

interface IClose extends IProps {
    onClose?: () => void;
}

export const ModalClose: FC<IClose> = ({
    className,
    children,
    onClose,
    ...restProps
}) => {
    return (
        <button
            type="button"
            className={twMerge(
                "text-primary m-auto mb-[-4rem] cursor-pointer appearance-none border-0 bg-transparent px-4 py-4 text-7xl font-light leading-[0.87] opacity-50",
                className
            )}
            onClick={onClose}
            {...restProps}
            data-dismiss="modal"
            aria-label="Close"
        >
            <span aria-hidden="true">{children}</span>
        </button>
    );
};

export const ModalBody: FC<IProps> = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <div
            className={twMerge(className, "relative flex-auto px-4 py-4")}
            {...restProps}
        >
            {children}
        </div>
    );
};

export const ModalFooter: FC<IProps & { bg?: string }> = ({
    className,
    children,
    bg: _bg, // TODO (xavier-charles):: support bg colors
    ...restProps
}) => {
    return (
        <div
            className={twMerge(
                "flex flex-wrap items-center justify-end space-x-1 rounded-bl-lg rounded-br-lg border-t border-black px-3 py-3",
                className
            )}
            {...restProps}
        >
            {children}
        </div>
    );
};
