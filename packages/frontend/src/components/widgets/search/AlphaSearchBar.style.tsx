import styled from "@alphaday/shared/styled";

export const StyledCustomPlaceholder = styled.span`
    padding-top: 0.5px;
    color: ${({ theme }) => theme.colors.primaryVariant100};
    ${({ theme }) => theme.fontGroup.normal}
    width: 100%;
`;
export const StyledMenuHeader = styled.div`
    padding: 12px 12px 10px;
    color: ${({ theme }) => theme.colors.primaryVariant100};
    ${({ theme }) => theme.fontGroup.mini}
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.colors.btnRingVariant300};
    display: flex;
    align-items: center;

    .hot {
        width: 10px;
        height: 12px;
        margin: 1px 0 0 2px;
        color: ${({ theme }) => theme.colors.primaryVariant100};
        padding-bottom: 2px;
    }
`;
export const StyledSearchContainer = styled.div`
    max-width: 524px;
    width: 100%;
    height: 41px;
    color: ${({ theme }) => theme.colors.primary};
`;

export const StyledEmptyResultsContainer = styled.div`
    display: flex;
    width: 100%;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
    max-width: 524px;
    align-items: center;
    justify-content: center;
    overscroll-behavior: contain;
`;
export const StyledSpinner = styled.div`
    display: flex;
    width: 100%;
    height: 70px;
    align-items: center;
    justify-content: center;
`;
