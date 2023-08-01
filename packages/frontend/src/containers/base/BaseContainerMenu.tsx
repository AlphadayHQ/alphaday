import { FC, useMemo, useState } from "react";
import { themes } from "@alphaday/shared/styled";
import { useLayer } from "react-laag";
import { useAppSelector } from "src/api/store/hooks";
import { ReactComponent as CameraSVG } from "src/assets/icons/camera.svg";
import { ReactComponent as CloseSVG } from "src/assets/icons/close.svg";
import { ReactComponent as InfoSVG } from "src/assets/icons/info.svg";
import { ReactComponent as MaximizeSVG } from "src/assets/icons/maximize.svg";
import { ReactComponent as MinimizeSVG } from "src/assets/icons/minimize.svg";
import { ReactComponent as SettingsSVG } from "src/assets/icons/settings.svg";

import UI_CONFIG from "src/config/ui";
import {
    StyledModuleMenu,
    StyledMenuDivider,
    StyledMenuItem,
    StyledMenuText,
} from "./BaseContainer.style";

const { Z_INDEX_REGISTRY } = UI_CONFIG;
interface IBaseContainerMenu {
    widgetDescription: string;
    toggleSettings: (() => void) | undefined;
    toggleMaximize: (() => void) | undefined;
    toggleMinimize: (() => void) | undefined;
    toggleExpand: (() => void) | undefined;
    takeScreenshot: (() => void) | undefined;
    removeWidget: () => void;
    isWidgetOptions?: boolean | undefined;
}
const BaseContainerMenu: FC<IBaseContainerMenu> = ({
    widgetDescription,
    toggleSettings,
    toggleMaximize,
    toggleMinimize,
    toggleExpand,
    takeScreenshot,
    removeWidget,
    isWidgetOptions,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const { theme } = useAppSelector((state) => state.ui);

    const { renderLayer, triggerProps, layerProps } = useLayer({
        isOpen: showMenu,
        placement: "bottom-end",
        auto: false,
        triggerOffset: 6,
        onOutsideClick: () => setShowMenu(false),
    });

    const styledLayerProps = useMemo(
        () => ({
            ...layerProps,
            style: {
                ...layerProps.style,
                width: "200px",
                background: themes[theme].colors.backgroundVariant1100,
                color: themes[theme].colors.primary,
                border: `1px solid ${themes[theme].colors.btnRingVariant500}`,
                boxShadow: `0px 0px 35px 9px rgba(19, 21, 27, 0.7)`,
                borderRadius: `5px`,
                zIndex: Z_INDEX_REGISTRY.HEADER_MENU,
                opacity: showMenu ? 1 : 0,
                transform: showMenu ? "scale(1)" : "scale(0)",
                transformOrigin: "100% 0",
                transition: "transform 0.25s, opacity 0.25s",
                display: "flex",
                // eslint-disable-next-line @typescript-eslint/prefer-as-const
                flexDirection: "column" as "column",
            },
        }),
        [layerProps, showMenu, theme]
    );

    const IconStyle = {
        width: "17px",
        height: "17px",
    };

    const closeMenuAndCall = (func: (() => void) | undefined) => {
        if (func) {
            func();
            setShowMenu(false);
        }
    };

    return (
        <StyledModuleMenu isMenuOpen={showMenu}>
            <div
                className="button"
                onClick={(e) => {
                    e.preventDefault();
                    setShowMenu((prev) => !prev);
                }}
                title="Open/Close Menu"
                role="button"
                tabIndex={0}
                {...triggerProps}
            >
                <div className="kebabMenu">
                    <span />
                    <span />
                    <span className="circle" />
                    <span />
                    <span className="line" />
                    <span className="line" />
                </div>
            </div>
            {renderLayer(
                <div {...styledLayerProps} className="menuList">
                    <StyledMenuItem
                        onClick={() => closeMenuAndCall(toggleSettings)}
                        tabIndex={0}
                        role="button"
                        disabled={toggleSettings === undefined}
                    >
                        <SettingsSVG
                            style={{ ...IconStyle, padding: "2px" }}
                            className="icon"
                        />
                        <StyledMenuText>
                            {isWidgetOptions ? "Close Options" : "Options"}
                        </StyledMenuText>
                    </StyledMenuItem>

                    <StyledMenuItem
                        onClick={() => closeMenuAndCall(toggleMaximize)}
                        tabIndex={0}
                        role="button"
                        disabled={toggleMaximize === undefined}
                    >
                        <MaximizeSVG
                            style={{ ...IconStyle, padding: "2px" }}
                            className="icon"
                        />
                        <StyledMenuText>Maximize</StyledMenuText>
                    </StyledMenuItem>

                    <StyledMenuItem
                        onClick={() =>
                            closeMenuAndCall(toggleExpand || toggleMinimize)
                        }
                        tabIndex={0}
                        role="button"
                    >
                        {toggleExpand ? (
                            <MaximizeSVG
                                style={{ ...IconStyle, padding: "2px" }}
                                className="icon"
                            />
                        ) : (
                            <MinimizeSVG style={IconStyle} className="icon" />
                        )}
                        <StyledMenuText>
                            {toggleExpand ? "Expand" : "Minimize"}
                        </StyledMenuText>
                    </StyledMenuItem>

                    <StyledMenuItem
                        onClick={() => closeMenuAndCall(takeScreenshot)}
                        tabIndex={0}
                        role="button"
                        disabled={takeScreenshot === undefined}
                    >
                        <CameraSVG style={IconStyle} className="icon" />
                        <StyledMenuText>Screenshot</StyledMenuText>
                    </StyledMenuItem>
                    <StyledMenuItem
                        onClick={() => closeMenuAndCall(removeWidget)}
                        tabIndex={0}
                        role="button"
                        disabled={removeWidget === undefined}
                    >
                        <CloseSVG style={IconStyle} className="icon" />

                        <StyledMenuText>Remove Widget</StyledMenuText>
                    </StyledMenuItem>
                    <StyledMenuDivider />
                    <StyledMenuItem className="description">
                        <InfoSVG
                            style={{ minWidth: "15px", marginTop: "2.5px" }}
                            className="icon"
                        />
                        <StyledMenuText>{widgetDescription}</StyledMenuText>
                    </StyledMenuItem>
                </div>
            )}
        </StyledModuleMenu>
    );
};

export default BaseContainerMenu;
