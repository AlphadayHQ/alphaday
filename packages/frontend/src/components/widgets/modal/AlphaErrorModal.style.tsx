import { Modal, ModalHeader, ModalTitle } from "@alphaday/components";
import styled from "@alphaday/shared";
import UI_CONFIG from "src/config/ui";

const { Z_INDEX_REGISTRY } = UI_CONFIG;

export const StyledModal = styled(({ ...props }) => <Modal {...props} />)`
    z-index: ${Z_INDEX_REGISTRY.ERROR_MODAL};
    background-color: ${({ theme }) => theme?.colors?.btnBackgroundVariant1900};
    .modal-content {
        background-color: #191c1f;
    }
`;

export const StyledModalHeader = styled(({ ...props }) => (
    <ModalHeader {...props} />
))`
    background-color: ${({ theme, variant }) =>
        variant === "warning"
            ? theme?.colors?.secondaryOrange
            : theme?.colors?.danger};
    .modal-header {
        background-color: ${({ theme, variant }) =>
            variant === "warning"
                ? theme?.colors?.secondaryOrange
                : theme?.colors?.danger};
    }
`;

export const StyledModalTitle = styled(({ ...props }) => (
    <ModalTitle {...props} />
))``;

export const StyledCenteredBlock = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
`;
