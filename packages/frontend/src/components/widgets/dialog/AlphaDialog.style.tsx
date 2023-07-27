import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@alphaday/components";
import styled from "@alphaday/shared";

export const StyledModal = styled(({ ...props }) => <Modal {...props} />)`
    background-color: ${({ theme }) => theme.colors.backgroundVariant1600};
    overflow: hidden;
    .modal-content {
        max-width: 429px;
        background-color: ${({ theme }) => theme.colors.backgroundVariant200};
        border: 1px solid ${(props) => props.theme.colors.backgroundVariant300};
        box-shadow: 0px 0px 0px 1px
            ${({ theme }) => theme.colors.backgroundVariant200};
        border-radius: 5px;
        padding-bottom: 20px;
    }
`;
export const StyledModalBody = styled(({ ...props }) => (
    <ModalBody {...props} />
))`
    display: flex;
    padding: 15px;
`;

export const StyledModalHeader = styled(({ ...props }) => (
    <ModalHeader {...props} />
))`
    border: 0;
    padding: 0;
    padding: 15px;
    .close {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.backgroundVariant200};
        border: 1.5px solid ${({ theme }) => theme.colors.primaryVariant200};
        outline: none;
        --webkit-tap-highlight-color: transparent;

        .icon {
            width: 8.4px;
            height: 8.4px;
        }
    }
`;

export const StyledModalFooter = styled(({ ...props }) => (
    <ModalFooter {...props} />
))`
    border: 0;
    display: flex;
    justify-content: center;
    padding-bottom: 15px;
`;

export const StyledModalTitle = styled(({ ...props }) => (
    <ModalTitle {...props} />
))`
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    align-self: center;

    /* identical to box height, or 150% */

    /* Primary/Light */

    color: ${({ theme }) => theme.colors.primary};
`;
