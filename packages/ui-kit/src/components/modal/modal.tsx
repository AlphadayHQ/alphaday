import { FC, useRef } from "react";
import { IonModal, IonButton, IonContent } from "@ionic/react";
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
     * Id of element to trigger the modal to open.
     */
    triggerId: string;
    /**
     * Modal Sizes
     */
    size?: "xl" | "lg" | "md" | "sm";
    /**
     * Callback function for close modal
     */
    onClose?: () => void;
}

export const Modal: FC<IModal> = ({
    className,
    children,
    onClose,
    triggerId,
}) => {
    const modal = useRef<HTMLIonModalElement>(null);

    return (
        <IonModal
            ref={modal}
            trigger={triggerId}
            onWillDismiss={() => onClose?.()}
            className={className}
        >
            <IonButton onClick={() => modal.current?.dismiss()}>
                Cancel
            </IonButton>
            <IonContent className="ion-padding">{children}</IonContent>
        </IonModal>
    );
};

export const ModalHeader: FC<IProps> = ({
    className,
    children,
    ...restProps
}) => {
    return (
        <div
            className={twMerge(
                className,
                "flex items-start justify-between rounded-t-[calc(0.3rem-1px)] p-4"
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
                className,
                "text-primary m-auto mb-[-4rem] cursor-pointer appearance-none border-0 bg-transparent px-4 py-4 text-7xl font-light leading-[0.87] opacity-50"
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
    bg: _bg, // TODO: support bg colors
    ...restProps
}) => {
    return (
        <div
            className={twMerge(
                className,
                "flex flex-wrap items-center justify-end space-x-1 rounded-bl-lg rounded-br-lg border-t border-black px-3 py-3"
            )}
            {...restProps}
        >
            {children}
        </div>
    );
};
