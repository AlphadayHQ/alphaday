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
    const { activeModal, closeActiveModal } = useControlledModal();
    return (
        <Modal
            showModal={activeModal ? activeModal === modalId : !!showModal}
            onClose={() => {
                onClose?.();
                closeActiveModal();
            }}
            {...props}
        >
            {children}
        </Modal>
    );
};
