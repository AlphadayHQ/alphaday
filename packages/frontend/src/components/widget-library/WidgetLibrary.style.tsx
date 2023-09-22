import { Modal } from "@alphaday/components";
import styled, { breakpoints } from "@alphaday/shared/styled";

export const StyledModal = styled(Modal)`
    /* background-color: ${({ theme }) => theme.colors.backgroundVariant1300};
    overflow: hidden;

    .modal-dialog {
        width: 100%;
        max-width: 100%;
        justify-content: center;
    }

    .modal-content {
        background-color: ${({ theme }) => theme.colors.backgroundVariant200};
        color: ${({ theme }) => theme.colors.primary};
        border: 2px solid ${({ theme }) => theme.colors.background};
        box-shadow: 0px 0px 0px 1px rgba(121, 131, 162, 0.2);
        border-radius: 5px;
        max-width: min(calc(100% - 20px), 1050px);
    } */
    .button {
        margin-right: 10px;
    }
    @media screen and (min-height: 800px) {
        display: flex;
        align-items: center;
    }
    /**
     * Ideally, the widgets lib should never be shown on mobile. Since it's toggle is hidden
     * But if for any reason it is, we would hide it.
     */
    @media screen and (max-width: ${breakpoints[2]}px) {
        display: none;
        .modal-dialog {
            display: none;
        }
    }
`;

export const StyledHr = styled.hr`
    margin: 0;
    width: 100%;
    border-color: ${({ theme }) => theme.colors.btnRingVariant500};
`;

export const StyledContainer = styled.div`
    /* --height: calc(85vh - 100px);
    position: relative;
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.backgroundVariant1500};
    max-height: var(--height); */

    /* .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 17px 25px;
        border-bottom: 1px solid
            ${({ theme }) => theme.colors.btnRingVariant500};
        color: ${({ theme }) => theme.colors.primaryVariant100};
        font-weight: 400;

        .tabs {
            display: flex;
            justify-content: space-around;
            align-items: center;
            span {
                margin-right: 7px;
            }
        }
    } */

    /* .cat-wrap {
        width: 280px;
        background-color: ${({ theme }) => theme.colors.backgroundVariant800};
        height: var(--height);
    } */

    .modules {
        /* width: 100%;
        height: var(--height);
        box-shadow: -2px 0px 34px rgba(0, 0, 0, 0.2); */

        /* .modules-list {
            height: calc(var(--height) - 120px);
            padding: 25px;
            .modules-wrap {
                display: flex;
                box-sizing: border-box;
                flex-flow: row wrap;
                width: 100%;

                .thumbnail {
                    width: min-content;
                    max-width: min-content;
                    margin: 10px;
                }
            }
        } */
    }

    /* .modules-count {
        margin: 25px 35px 10px;
        ${({ theme }) => theme.fontGroup.highlightSemi}
    } */

    /* .no-modules {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    } */
`;
