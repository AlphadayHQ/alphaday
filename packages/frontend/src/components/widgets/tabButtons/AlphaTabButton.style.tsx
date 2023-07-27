/* eslint-disable @typescript-eslint/no-unsafe-return */
import styled, { css } from "@alphaday/shared/styled";

interface IProps {
    $variant?: "primary" | "small" | "extraSmall" | "transparent" | "removable";
    $open?: boolean;
    disabled?: boolean;
    $uppercase?: boolean;
}

const buttonStyles = css<IProps>`
    border: 0;
    outline: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
    ${({ theme }) => theme.fontGroup.supportBold}
    width: max-content;
    height: 34px;
    padding: 6px 15px 7px 15px;
    border-radius: 8px;
    border: 1px solid;
    border-color: ${({ theme }) => theme.colors.btnRingVariant300};
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.btnBackgroundVariant100};

    text-transform: ${({ $uppercase }) => ($uppercase ? "uppercase" : "none")};

    .tabButton {
        fill: ${({ theme }) => theme.colors.primary};
        margin-right: 6px;
        width: 10px;
        height: 10px;
        align-self: center;
    }

    .close {
        align-self: center;
        margin-left: 3.5px;
        width: 7px;
    }

    &:hover {
        background-color: ${({ theme }) =>
            theme.colors.btnBackgroundVariant1000};
    }
    &:active {
        background-color: ${({ theme }) =>
            theme.colors.btnBackgroundVariant300};
    }

    ${({ $variant }) =>
        $variant === "transparent" &&
        css`
            background-color: transparent;
            padding: 0px 0px 1px 0px;
            border: 0;
            height: 21px;
            cursor: pointer;
            &:hover {
                background-color: transparent;
            }
            &:active {
                background-color: transparent;
            }
            .close {
                padding-right: 7px;
                width: 13.5px;
                cursor: pointer;
            }
        `};
    ${({ $variant }) =>
        ($variant === "small" || $variant === "removable") &&
        css`
            height: 26px;
            padding: 4px 8px 5px 8px;
            ${({ theme }) => theme.fontGroup.normal}
            border: 0;
            background-color: ${({ theme }) =>
                theme.colors.btnBackgroundVariant1100};
            &:hover {
                background-color: ${({ theme }) =>
                    theme.colors.btnBackgroundVariant1200};
            }
            &:active {
                background-color: ${({ theme }) =>
                    theme.colors.btnBackgroundVariant1300};
            }
        `};
    ${({ $variant }) =>
        $variant === "removable" &&
        css`
            padding-right: 0px;
            .close {
                padding-left: 3px;
                padding-right: 9px;
                width: 18.5px;
                cursor: pointer;
            }
        `};
    ${({ $variant }) =>
        $variant === "extraSmall" &&
        css`
            height: 26px;
            ${({ theme }) => theme.fontGroup.normal}
            padding: 1px 8px 1px 8px;
            border-radius: 8px;
            border: 0;
            color: ${({ theme }) => theme.colors.primaryVariant100};
            background-color: ${({ theme }) =>
                theme.colors.btnBackgroundVariant1100};
            border-color: ${({ theme }) => theme.colors.primaryVariant200};
            &:hover {
                background-color: ${({ theme }) =>
                    theme.colors.btnBackgroundVariant1200};
            }
            &:active {
                background-color: ${({ theme }) =>
                    theme.colors.btnBackgroundVariant1300};
            }
        `};
    ${({ disabled }) =>
        disabled &&
        css`
            color: ${({ theme }) => theme.colors.primaryVariant300};
            pointer-events: none;
            .tabButton {
                fill: ${({ theme }) => theme.colors.primaryVariant300};
                stroke: ${({ theme }) => theme.colors.primaryVariant300};
            }
        `}
    ${({ $open, $variant }) =>
        $open &&
        css`
            color: ${({ theme }) =>
                $variant === "extraSmall"
                    ? theme.colors.primaryVariant100
                    : theme.colors.primary};
            background-color: ${({ theme }) =>
                theme.colors.btnBackgroundVariant1400};
            border-color: ${({ theme }) =>
                !($variant === "small" || $variant === "extraSmall") &&
                theme.colors.btnBackgroundVariant1400};
            &:hover {
                background-color: ${({ theme }) =>
                    !($variant === "small" || $variant === "extraSmall")
                        ? theme.colors.btnBackgroundVariant1500
                        : theme.colors.btnBackgroundVariant1400};
            }
            &:active {
                background-color: ${({ theme }) =>
                    theme.colors.btnBackgroundVariant1400};
            }
            .tabButton {
                fill: ${({ theme }) => theme.colors.primary};
                stroke: ${({ theme }) => theme.colors.primary};
                pointer-events: auto;
            }
        `};
    &.portfolio-addWallet {
        border: 1px solid ${({ theme }) => theme.colors.primaryVariant100};
        background-color: ${({ theme }) =>
            theme.colors.btnBackgroundVariant1200};
        &:hover {
            background-color: ${({ theme }) =>
                theme.colors.btnBackgroundVariant1100};
        }
    }
`;

export const StyledButton = styled.button.attrs<IProps>((props) => ({
    className: props.className,
}))`
    ${buttonStyles}
`;

StyledButton.defaultProps = {
    $open: false,
    $variant: "primary",
};
