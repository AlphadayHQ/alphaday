import { CardBody, CardFooter } from "@alphaday/components";
import styled, { css } from "@alphaday/shared/styled";

export const StyledModuleMenu = styled.div<{ isMenuOpen: boolean }>`
    .button {
        fill: #767c8f;
        cursor: pointer;
        height: 30px;
        align-self: center;
        display: flex;
        align-items: center;
        .kebabMenu {
            margin-top: -1px;
            width: 20px;
            height: 20px;
            position: relative;

            span {
                width: 3px;
                height: 3px;
                border-radius: 50%;
                background: #767c8f;
                position: absolute;
                transition: 0.25s;
                opacity: 1;

                &:nth-child(1) {
                    top: 1.5px;
                    left: 8.5px;
                }
                &:nth-child(2) {
                    top: 8.5px;
                    left: 8.5px;
                }
                // hidden circle
                &:nth-child(3) {
                    top: 8.5px;
                    left: 8.5px;
                }
                &:nth-child(4) {
                    top: 15.5px;
                    left: 8.5px;
                }

                &.line {
                    top: 5px;
                    left: 9px;
                    height: 10px;
                    width: 2px;
                    border-radius: 3px;
                    opacity: 0;
                }
            }
        }
    }
    ${({ isMenuOpen }) =>
        isMenuOpen &&
        css`
            .button .kebabMenu span {
                opacity: 0;
            }
            .button .kebabMenu span.line {
                opacity: 1;
                background: ${({ theme }) =>
                    theme?.colors?.backgroundVariant400};
                &:nth-child(5) {
                    transform: rotate(45deg);
                }
                &:nth-child(6) {
                    transform: rotate(-45deg);
                }
            }
            .button .kebabMenu span.circle {
                opacity: 0.6;
                transform: scale(6);
            }
        `}
`;

export const StyledMenuDivider = styled.div`
    height: 0;
    overflow: hidden;
    border-top: 1px solid ${({ theme }) => theme?.colors?.btnRingVariant500};
    margin: 0;
    width: 200px;
`;

export const StyledMenuText = styled.div`
    padding: 0 12px;
    word-wrap: break-word;
    width: 100%;
`;

export const StyledMenuItem = styled.span<{ disabled?: boolean }>`
    padding: 6px 12px 6px;
    display: flex;
    align-items: center;
    cursor: pointer;
    ${({ disabled }) => disabled && `opacity: 0.5;`}

    &:hover {
        background-color: #1E2024};
    }

    &:nth-child(1) {
        padding-top: 12px;
        border-radius: 5px 5px 0 0;
    }
    &:nth-last-child(1) {
        padding-top: 18px;
        padding-bottom: 12px;
        border-radius: 0 0 5px 5px;
        display: flex;
        align-items: start;
        cursor: default;
    }
    ${({ disabled }) =>
        disabled &&
        `
    opacity: 0.5;
    &:hover {
        background: none;
    }
    cursor: not-allowed;
    `}
`;

export const StyledModuleFlip = styled.div`
    div:only-child:not(:empty) {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .flip-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        .adjust-height-handle {
            width: calc(100% + 6px);
            position: absolute;
            left: -3px;
            height: 15px;
            bottom: -18px;
            border: none;
            cursor: row-resize;
        }
    }

    .flipped {
        position: absolute;
        top: 0;
        transform: rotateX(180deg);
        transform-origin: top;
    }

    .flip {
        width: 100%;
        backface-visibility: hidden;
        transition: transform 0.8s;
    }
`;

export const StyledModuleWrapper = styled.div<{
    $height?: number;
}>`
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #212328;
    color: #767c8f;
    border: 2px solid #111213;
    box-shadow: 0px 0px 0px 1px rgba(121, 131, 162, 0.2);
    border-radius: 5px;
    overflow: hidden;

    height: ${({ $height }) => ($height ? `${String($height)}px` : "auto")};
`;

export const StyledModuleHeader = styled.div`
    background-color: #27292e;
    color: #767c8f;
    background-blend-mode: soft-light;
    padding: 4.5px 9px 4.5px 15px;
    border-bottom: 1.2px solid #111213;
    border-radius: 3px;

    .wrap {
        height: inherit;
        width: 100%;
        display: flex;
        padding-bottom: 2px;
    }

    .header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .tooltip {
        align-self: center;
    }

    .searchTags {
        padding-left: 6px;
        line-height: 18px;
        button {
            align-items: end;
        }
        svg {
            align-self: end;
            padding-bottom: 3px;
        }
    }

    .pad {
        padding: 9px 0;
    }

    .button {
        fill: #767c8f;
        cursor: pointer;
        height: 30px;
        align-self: center;
        display: flex;
        align-items: center;
    }
`;

export const StyledModuleFooter = styled(({ ...rest }) => (
    <CardFooter {...rest} />
))`
    color: #767c8f;
    border-top: 0.8px solid ${({ theme }) => theme?.colors?.btnRingVariant500};

    width: 100%;
    display: flex;
    justify-content: center;
    align-self: end;
`;

export const StyledModuleBody = styled(({ ...rest }) => <CardBody {...rest} />)`
    padding: 0;
    overflow: hidden;
    height: inherit;
    display: flex !important;
    justify-content: space-between;
    flex-direction: column;

    .searchTags {
        margin: 10px;

        .close:hover * {
            stroke: #ba7a02;
        }
        .persisted * {
            color: #e1b74f;
            opacity: 0.9;
        }
    }
    .settings {
        padding: 15px;
        flex-shrink: 1;
    }
    .setting-title {
        margin-bottom: 10px;
    }
`;
export const StyledModuleTitle = styled.h6`
    display: inline-flex;
    align-self: end;
    ${({ theme }) => theme?.fontGroup?.highlight}
    text-transform: uppercase;
    color: #767c8f;
    margin: 0;
`;

export const StyledSvgWrapper = styled.span`
    svg {
        height: 10px;
    }
    margin-right: 8px;
`;
