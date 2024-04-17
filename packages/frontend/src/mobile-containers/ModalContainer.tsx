import { FC } from "react";
import { Modal, IModal } from "@alphaday/ui-kit";
import { useControlledModal } from "src/api/store/providers/controlled-modal-provider";

export const ModalContainer: FC<IModal & { modalId: string }> = ({
    modalId,
    showModal,
    onClose,
    children,
    ...props
}) => {
    const { activeModal, closeModal } = useControlledModal();
    return (
        <Modal
            size="sm"
            showModal={
                activeModal
                    ? activeModal === modalId && !!showModal
                    : !!showModal
            }
            onClose={() => {
                onClose?.();
                closeModal();
            }}
            {...props}
        >
            {children}
        </Modal>
    );
};
