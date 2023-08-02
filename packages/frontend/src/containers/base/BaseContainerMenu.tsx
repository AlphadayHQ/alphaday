import { FC, useMemo, useState } from "react";
import { themes, twMerge, useLayer } from "@alphaday/ui-kit";
import { ReactComponent as CameraSVG } from "src/assets/icons/camera.svg";
import { ReactComponent as CloseSVG } from "src/assets/icons/close.svg";
import { ReactComponent as InfoSVG } from "src/assets/icons/info.svg";
import { ReactComponent as MaximizeSVG } from "src/assets/icons/maximize.svg";
import { ReactComponent as MinimizeSVG } from "src/assets/icons/minimize.svg";
import { ReactComponent as SettingsSVG } from "src/assets/icons/settings.svg";
import UI_CONFIG from "src/config/ui";

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

const KebabMenu: FC<{ showMenu: boolean }> = ({ showMenu }) => {
    const KebabIconVectorPos = [
        [1.5, 8.5],
        [1.5, 8.5],
        [1.5, 8.5],
        [15.5, 8.5],
    ];
    const otherClasses =
        "w-[3px] h-[3px] bg-primaryVariant100 absolute transition-[0.25s] opacity-100 rounded-[50%]";
    return (
        <div
            className={twMerge(
                "relative -mt-px h-5 w-5",
                showMenu &&
                    "[&>:nth-child(3)]:scale-[6] [&>:nth-child(3)]:opacity-60"
            )}
        >
            {KebabIconVectorPos.map(([top, left]) => (
                <span
                    key={`${top}-${left}`}
                    className={`left-[${left}px] top-[${top}px] ${otherClasses}`}
                />
            ))}
            <span
                className={twMerge(
                    "fill-primaryVariant100 flex h-[30px] cursor-pointer items-center self-center",
                    otherClasses,
                    showMenu && "bg-backgroundVariant400 -rotate-45 opacity-100"
                )}
            />
            <span
                className={twMerge(
                    "fill-primaryVariant100 flex h-[30px] cursor-pointer items-center self-center",
                    otherClasses,
                    showMenu && "bg-backgroundVariant400 rotate-45 opacity-100"
                )}
            />
        </div>
    );
};

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
    // TODO (xavier-charles): remove hard coded themes
    const { colors } = themes.dark;

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
                background: colors.backgroundVariant1100,
                color: colors.primary,
                border: `1px solid ${colors.btnRingVariant500}`,
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
        [colors, layerProps, showMenu]
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
        <div>
            <div
                className="fill-primaryVariant100 flex h-[30px] cursor-pointer items-center self-center"
                onClick={(e) => {
                    e.preventDefault();
                    setShowMenu((prev) => !prev);
                }}
                title="Open/Close Menu"
                role="button"
                tabIndex={0}
                {...triggerProps}
            >
                <KebabMenu showMenu={showMenu} />
            </div>
            {renderLayer(
                <div {...styledLayerProps} className="menuList">
                    <div
                        onClick={() => closeMenuAndCall(toggleSettings)}
                        tabIndex={0}
                        role="button"
                        className={twMerge(
                            "flex cursor-pointer items-center px-3 py-1.5",
                            toggleSettings === undefined &&
                                "cursor-not-allowed bg-transparent opacity-50"
                        )}
                    >
                        <SettingsSVG
                            style={{ ...IconStyle, padding: "2px" }}
                            className="icon"
                        />
                        <div className="break-word w-full px-3 py-0">
                            {isWidgetOptions ? "Close Options" : "Options"}
                        </div>
                    </div>

                    <div
                        onClick={() => closeMenuAndCall(toggleMaximize)}
                        tabIndex={0}
                        role="button"
                        className={twMerge(
                            "flex cursor-pointer items-center px-3 py-1.5",
                            toggleMaximize === undefined &&
                                "cursor-not-allowed bg-transparent opacity-50"
                        )}
                    >
                        <MaximizeSVG
                            style={{ ...IconStyle, padding: "2px" }}
                            className="icon"
                        />
                        <div className="break-word w-full px-3 py-0">
                            Maximize
                        </div>
                    </div>

                    <div
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
                        <div className="break-word w-full px-3 py-0">
                            {toggleExpand ? "Expand" : "Minimize"}
                        </div>
                    </div>

                    <div
                        onClick={() => closeMenuAndCall(takeScreenshot)}
                        tabIndex={0}
                        role="button"
                        className={twMerge(
                            "flex cursor-pointer items-center px-3 py-1.5",
                            takeScreenshot === undefined &&
                                "cursor-not-allowed bg-transparent opacity-50"
                        )}
                    >
                        <CameraSVG style={IconStyle} className="icon" />
                        <div className="break-word w-full px-3 py-0">
                            Screenshot
                        </div>
                    </div>
                    <div
                        onClick={() => closeMenuAndCall(removeWidget)}
                        tabIndex={0}
                        role="button"
                        className={twMerge(
                            "flex cursor-pointer items-center px-3 py-1.5",
                            removeWidget === undefined &&
                                "cursor-not-allowed bg-transparent opacity-50"
                        )}
                    >
                        <CloseSVG style={IconStyle} className="icon" />

                        <div className="break-word w-full px-3 py-0">
                            Remove Widget
                        </div>
                    </div>
                    <div className="border--btnRingVariant500 m-0 h-0 w-[200px] overflow-hidden border-t border-solid" />
                    <div className="description">
                        <InfoSVG
                            style={{ minWidth: "15px", marginTop: "2.5px" }}
                            className="icon"
                        />
                        <div className="break-word w-full px-3 py-0">
                            {widgetDescription}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseContainerMenu;
