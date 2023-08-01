/* eslint-disable @typescript-eslint/no-unsafe-return */
import styled, { css } from "@alphaday/shared/styled";

interface IProps {
    $variant?:
        | "primaryXL"
        | "secondaryXL"
        | "primary"
        | "secondary"
        | "small"
        | "extraSmall";
    colorVariant?: "default" | "error";
    disabled?: boolean;
    $uppercase?: boolean;
}

const buttonStyles = css<IProps>`
    border: 0;
    outline: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.2px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    line-height: 1.5;
    user-select: none;
    transition:
        color 0.15s ease-in-out,
        background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
    &:hover,
    &:active,
    &:focus {
        outline: none;
    }
    ${({ theme }) => theme?.fontGroup?.highlight}
    width: max-content;
    height: 34px;
    padding: 4px 15px 7px 15px;
    border-radius: 10px;
    border: 1px solid;
    border-color: ${({ theme }) => theme?.colors?.btnRingVariant100};
    color: ${({ theme }) => theme?.colors?.primary};
    background-color: ${({ theme, colorVariant }) =>
        colorVariant === "error"
            ? theme?.colors?.dangerFiltered
            : theme?.colors?.btnBackgroundVariant100};

    &:hover {
        background-color: ${({ theme }) =>
            theme?.colors?.btnBackgroundVariant400};
    }
    &:active {
        background-color: ${({ theme }) =>
            theme?.colors?.btnBackgroundVariant300};
    }
    ${({ $variant }) =>
        $variant === "primaryXL" &&
        css`
            height: 54px;
            border: 2px solid;
            padding: 16px 25px 16px 25px;
            border-color: ${({ theme }) => theme?.colors?.btnRingVariant200};
            box-sizing: border-box;
            &:hover {
                border-color: ${({ theme }) => theme?.colors?.btnRingVariant100};
            }
            &:active {
                background-color: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant700};
            }
        `};
    ${({ $variant }) =>
        $variant === "secondaryXL" &&
        css`
            height: 54px;
            padding: 16px 25px 16px 25px;
            border-color: ${({ theme }) => theme?.colors?.btnRingVariant300};
            box-sizing: border-box;
            &:active {
                background-color: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant700};
            }
        `};
    ${({ $variant }) =>
        $variant === "secondary" &&
        css`
            border-color: ${({ theme }) => theme?.colors?.btnRingVariant300};
        `};
    ${({ $variant }) =>
        $variant === "small" &&
        css`
            height: 29px;
            padding: 2px 20px 3px 20px;
            ${({ theme }) => theme?.fontGroup?.normal}
            background-color: ${({ theme }) =>
                theme?.colors?.btnBackgroundVariant200};
            border-color: ${({ theme }) => theme?.colors?.btnRingVariant300};
            &:hover {
                background-color: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant500};
            }
            &:active {
                background-color: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant800};
            }
        `};
    ${({ $variant }) =>
        $variant === "extraSmall" &&
        css`
            height: 26px;
            ${({ theme }) => theme?.fontGroup?.normal}
            padding: 4px 12px 5px 12px;
            color: ${({ theme }) => theme?.colors?.primaryVariant100};
            background-color: ${({ theme }) =>
                theme?.colors?.btnBackgroundVariant300};
            border-color: ${({ theme }) => theme?.colors?.primaryVariant200};
            &:hover {
                background-color: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant600};
            }
            &:active {
                background-color: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant900};
            }
        `};
    &.alphaDialog {
        padding: 12px 55px;
    }
    ${({ disabled }) =>
        disabled &&
        css`
            color: ${({ theme }) => theme?.colors?.primaryVariant100};
            border-color: ${({ theme }) => theme?.colors?.btnRingVariant200};
            pointer-events: none;
        `}
`;

export const StyledButton = styled.button.attrs<IProps>((props) => ({
    className: props.className,
}))`
    ${buttonStyles}
`;

StyledButton.defaultProps = {
    $variant: "primaryXL",
};
