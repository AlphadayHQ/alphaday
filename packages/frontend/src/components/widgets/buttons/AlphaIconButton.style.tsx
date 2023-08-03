/* eslint-disable @typescript-eslint/no-unsafe-return */
import styled, { css } from "@alphaday/shared/styled";

export type TVariant =
    | "info"
    | "close"
    | "closeWithBg"
    | "notification"
    | "profile"
    | "trash"
    | "star"
    | "leftArrow"
    | "rightArrow"
    | "downArrow";

interface IProps {
    $variant?: TVariant;
    disabled?: boolean;
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
    padding: 0;
    background: transparent;
    &:hover,
    &:active,
    &:focus {
        outline: none;
    }

    ${({ $variant }) =>
        $variant === "info" &&
        css`
            svg {
                width: 13.93px;
                height: 13.93px;
                stroke: ${({ theme }) => theme?.colors?.primaryVariant100};
            }
            &:hover {
                svg {
                    stroke: ${({ theme }) => theme?.colors?.primaryVariant800};
                }
            }
            &:active {
                svg {
                    stroke: ${({ theme }) => theme?.colors?.primaryVariant900};
                }
            }
        `};
    ${({ $variant }) =>
        $variant === "close" &&
        css`
            svg {
                width: 24px;
                height: 24px;
                stroke: ${({ theme }) => theme?.colors?.primaryVariant100};
            }
            &:hover {
                svg {
                    stroke: ${({ theme }) => theme?.colors?.primaryVariant800};
                }
            }
            &:active {
                svg {
                    stroke: ${({ theme }) => theme?.colors?.primaryVariant1000};
                }
            }
        `};
    ${({ $variant, disabled }) =>
        $variant === "closeWithBg" &&
        css`
            background: ${({ theme }) =>
                theme?.colors?.btnBackgroundVariant100};
            border: 1px solid ${({ theme }) => theme?.colors?.btnRingVariant300};
            border-radius: 100px;
            padding: 8px;
            svg {
                width: 8.4px;
                height: 8.4px;
                stroke: ${({ theme }) => theme?.colors?.primaryVariant100};
            }
            &:hover {
                background: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant1000};
            }
            &:active {
                background: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant700};
                border: 1px solid
                    ${({ theme }) => theme?.colors?.btnRingVariant500};
            }
            ${disabled
                ? css`
                      opacity: 0.2;
                  `
                : ""}
        `};
    ${({ $variant, disabled }) =>
        $variant === "notification" &&
        css`
            background: ${({ theme }) =>
                theme?.colors?.btnBackgroundVariant100};
            border: 1px solid ${({ theme }) => theme?.colors?.btnRingVariant300};
            border-radius: 100px;
            padding: 8px;
            svg {
                width: 16px;
                height: 18px;
                fill: ${({ theme }) => theme?.colors?.white};
            }
            &:hover {
                background: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant1000};
            }
            &:active {
                background: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant700};
                border: 1px solid
                    ${({ theme }) => theme?.colors?.btnRingVariant500};
            }
            ${disabled
                ? css`
                      opacity: 0.2;
                  `
                : ""}
        `};
    ${({ $variant, disabled }) =>
        $variant === "profile" &&
        css`
            background: ${({ theme }) =>
                theme?.colors?.btnBackgroundVariant100};
            border: 1px solid ${({ theme }) => theme?.colors?.btnRingVariant300};
            border-radius: 100px;
            padding: 7.5px;
            svg {
                width: 16px;
                height: 18px;
                fill: ${({ theme }) => theme?.colors?.white};
            }
            &:hover {
                background: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant1000};
            }
            &:active {
                background: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant700};
                border: 1px solid
                    ${({ theme }) => theme?.colors?.btnRingVariant500};
            }
            ${disabled
                ? css`
                      opacity: 0.2;
                  `
                : ""}
        `};
    ${({ $variant, disabled }) =>
        $variant === "trash" &&
        css`
            position: relative;
            background: ${({ theme }) =>
                theme?.colors?.btnBackgroundVariant100};
            border: 1px solid ${({ theme }) => theme?.colors?.btnRingVariant300};
            border-radius: 100px;
            padding: 20.59px;
            transition: all 0.2s ease-in-out;

            .text {
                opacity: 0;
            }
            svg {
                opacity: 1;
                position: absolute;
                width: 28.82px;
                height: 28.82px;
                stroke: ${({ theme }) => theme?.colors?.primaryVariant100};
            }
            &:hover {
                background: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant1000};
                .text {
                    opacity: 1;
                }
                svg {
                    opacity: 0;
                }
            }
            ${disabled
                ? css`
                      opacity: 0.2;
                  `
                : ""}
        `};
    ${({ $variant }) =>
        $variant === "star" &&
        css`
            svg {
                width: 18.84px;
                height: 18px;
                fill: ${({ theme }) => theme?.colors?.primaryVariant100};
            }
            &:hover {
                svg {
                    fill: ${({ theme }) => theme?.colors?.btnRingVariant100};
                }
            }
            &:active {
                svg {
                    fill: ${({ theme }) =>
                        theme?.colors?.btnBackgroundVariant1400};
                }
            }
        `};
    ${({ $variant, disabled }) =>
        ($variant === "leftArrow" || $variant === "rightArrow") &&
        css`
            background: rgb(0, 0, 0, 0.8);
            border: 1px solid ${({ theme }) => theme?.colors?.btnRingVariant300};
            border-radius: 100px;
            padding: 6.5px;
            svg {
                width: 18px;
                height: 18px;
                stroke: ${({ theme }) => theme?.colors?.primary};
            }
            &:hover {
                background: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant1000};
            }
            &:active {
                background: ${({ theme }) =>
                    theme?.colors?.btnBackgroundVariant700};
                border: 1px solid
                    ${({ theme }) => theme?.colors?.btnRingVariant500};
            }
            ${disabled
                ? css`
                      opacity: 0.2;
                  `
                : ""}
        `};
`;

export const StyledButton = styled.span<IProps>`
    ${buttonStyles}
`;

StyledButton.defaultProps = {
    $variant: "info",
};
