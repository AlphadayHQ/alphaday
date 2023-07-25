import styled, { device, css, layout, space } from "@doar/shared/styled";
import UI_CONFIG from "src/config/ui";

const { Z_INDEX_REGISTRY } = UI_CONFIG;

interface IHeader {
    mobileOpen?: boolean;
}

export const StyledWrapper = styled.header<{ $boardsLibOpen: boolean }>`
    z-index: ${Z_INDEX_REGISTRY.HEADER};
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    right: 0;
    ${({ $boardsLibOpen }) =>
        $boardsLibOpen &&
        `
        position: static;
        margin-bottom: -110px;
    `};
`;

export const StyledHeader = styled.header<IHeader>`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    align-items: stretch;
    height: ${({ mobileOpen }) => (mobileOpen ? "auto" : "64px")};
    padding: 0;
    background-color: ${({ theme }) => theme.colors.backgroundVariant100};

    .wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    .center {
        justify-content: center;
        margin: auto 10px;
    }

    .boards {
        padding: 10px 0 0 12px;
        font-size: 14px;
    }

    ${device.large} {
        height: 60px;
        top: 0;
        left: 0;
        right: 0;
    }

    ${device.small} {
        .boards {
            padding: 10px 0 0 15px;
        }
    }
`;

export const StyledLogo = styled.div`
    font-size: 1.09375rem;
    line-height: inherit;
    white-space: nowrap;
    display: flex;
    padding: 20px 20px 21px 20px;
    align-items: center;
    margin-right: 0;
    order: 1;
    ${device.small} {
        padding-left: 15px;
    }
    ${device.large} {
        width: 170px;
        padding: 0 0 0 20px;
    }
`;

export const StyledSearch = styled.div`
    width: 300px;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    order: 2;
    ${device.small} {
        width: 350px;
    }
    ${device.large} {
        width: 404px;
    }
    ${device.xxlarge} {
        width: 524px;
    }
`;

export const StyleNavbarRight = styled.div`
    padding: 0 20px 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    order: 2;
    margin-top: -2px;
    ${device.small} {
        padding: 0 15px;
    }
    ${device.large} {
        order: 3;
        padding: 0 20px 0 0;
    }
`;
interface IProps {
    showWidgetLib?: boolean;
    ml?: string[];
    mr?: string[];
}
export const StyledNavbarElement = styled.div<IProps>`
    ${space};
    ${layout};
    .header-icon {
        width: 16px;
        height: 16px;
        stroke-width: 3px;

        ${device.small} {
            width: 20px;
            height: 20px;
            stroke-width: 2.25px;
        }
        ${({ theme }) =>
            theme.name !== "dark" &&
            css`
                color: ${theme.colors.text};
            `}
        ${({ theme }) =>
            theme.name === "dark" &&
            css`
                color: ${theme.colors.gray300};
                &:hover,
                &:focus {
                    color: ${theme.colors.white};
                }
            `}
    }

    &.widgetLibrary {
        transition: 0.5s ease-in-out;
        transform: ${({ showWidgetLib }) =>
            showWidgetLib ? "translateX(-180px)" : "translateX(0px)"};
    }
`;
