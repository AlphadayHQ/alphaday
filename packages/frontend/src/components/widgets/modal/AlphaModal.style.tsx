/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Modal } from "@alphaday/components";
import styled from "@alphaday/shared";

export const StyledModal = styled(({ ...props }) => <Modal {...props} />)<{
    $contain?: boolean;
}>`
    overflow: auto;
    background-color: ${({ theme }) => theme.colors.backgroundVariant1200};

    .modal-dialog {
        width: 100%;
        ${({ $contain }) => !$contain && "max-width: 1600px;"}
        min-height: 0;
        height: max-content;
        border-radius: 5px;
    }
    .modal-content {
        display: block;
        position: relative;
        min-height: 400px;
        ${({ $contain }) =>
            !$contain &&
            `
        min-width: 1150px;
        `}
        background-color: ${({ theme }) => theme.colors.backgroundVariant800};
        border: 2px solid ${(props) => props.theme.colors.background};
        box-shadow: 0px 0px 0px 1px rgba(121, 131, 162, 0.2);
        border-radius: 5px;
        margin: 15px;
    }
    .foot-block {
        position: absolute;
        background-color: ${({ theme }) => theme.colors.backgroundVariant800};
        width: 100%;
        height: 5px;
        bottom: 0.6px;
    }

    @media screen and (min-height: 800px) {
        display: flex;
        align-items: center;
    }
`;

export const StyledModalContent = styled.div`
    padding: 15px;
    height: 100%;
    color: #767c8f;

    .setting-title {
        ${({ theme }) => theme.fontGroup.normal}
        margin-bottom: 10px;
    }
`;
