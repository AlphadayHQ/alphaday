import { FC, Fragment, useId } from "react";
import { Dialog, Transition } from "@headlessui/react";

import createSharedState from "src/hooks/use-shared-state";
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
     * Modal Sizes
     */
    size?: "max" | "xl" | "lg" | "md" | "sm" | "xs";
    /**
     * Callback function for close modal
     */
    onClose?: () => void;
}

const useCurrentModalId = createSharedState<string>("current-modal");

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

export const Modal: FC<IModal> = ({
    onClose,
    size,
    className,
    children,
    showModal,
}) => {
    const modalId = useId();
    const [currentModalId, setCurrentModalId] = useCurrentModalId("");
    const maxWidth = {
        max: "1600px",
        xl: "1050px",
        lg: "800px",
        md: "650px",
        sm: "450px",
        xs: "360px",
    }[size || "xl"];

    const handleClose = (val: boolean) => {
        if (!val) onClose?.();
        setCurrentModalId("");
    };

    if (showModal && !currentModalId) {
        setCurrentModalId(modalId);
    }

    console.log("currentModalId", currentModalId, modalId);

    return (
        <Transition.Root
            show={showModal && currentModalId === modalId}
            as={Fragment}
        >
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-opacity-75 transition-opacity bg-backgroundFiltered" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                style={{
                                    boxShadow:
                                        "0px 0px 0px 1px rgba(121, 131, 162, 0.2)",
                                    maxWidth: `min(calc(100% - 20px), ${maxWidth})`,
                                }}
                                className={twMerge(
                                    "flex bg-background text-primary border border-borderLine rounded-[5px] w-full",
                                    className
                                )}
                            >
                                <div className="w-full">{children}</div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
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
                "flex items-start justify-between rounded-t-[calc(0.3rem-1px)] px-4 py-3",
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
        <h6
            className={twMerge(className, "mb-0 leading-6 text-white")}
            {...restProps}
        >
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
