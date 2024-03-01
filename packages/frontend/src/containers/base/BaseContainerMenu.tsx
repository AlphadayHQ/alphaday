import { FC, useMemo, useState } from "react";
import { themeColors, twMerge, useLayer } from "@alphaday/ui-kit";
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
        "top-[1.5px]",
        "top-[8.5px]",
        "top-[8.5px]",
        "top-[15.5px]",
    ];
    const otherClasses =
        "w-[3px] h-[3px] bg-primaryVariant100 absolute transition-[0.25s] opacity-100 rounded-[50%]";
    return (
        <div
            className={twMerge(
                "relative -mt-px h-5 w-5",
                showMenu &&
                    "[&>:nth-child(3)]:scale-[6] [&>:nth-child(3)]:opacity-100"
            )}
        >
            {KebabIconVectorPos.map((top, i) => (
                <span
                    key={`${top + i.toString()}`}
                    className={`left-[8.5px] ${top} ${otherClasses}`}
                />
            ))}
            <span
                className={twMerge(
                    "fill-primaryVariant100 flex cursor-pointer items-center self-center",
                    otherClasses,
                    "opacity-0",
                    showMenu &&
                        "bg-background h-[10px] w-0.5 top-[5px] left-[9px] -rotate-45 opacity-100"
                )}
            />
            <span
                className={twMerge(
                    "fill-primaryVariant100 flex cursor-pointer items-center self-center",
                    otherClasses,
                    "opacity-0",
                    showMenu &&
                        "bg-background h-[10px] w-0.5 top-[5px] left-[9px] rotate-45 opacity-100"
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
                background: themeColors.background,
                color: themeColors.primary,
                border: `1px solid ${themeColors.borderLine}`,
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
        [layerProps, showMenu]
    );

    const IconStyle = {
        width: "17px",
        height: "17px",
    };

    const closeMenuAndCall = (callback: (() => void) | undefined) => {
        if (callback) {
            callback();
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
                <div {...styledLayerProps}>
                    <div
                        onClick={() => closeMenuAndCall(toggleSettings)}
                        tabIndex={0}
                        role="button"
                        className={twMerge(
                            "flex cursor-pointer items-center p-3 pb-1.5",
                            toggleSettings === undefined &&
                                "cursor-not-allowed bg-transparent opacity-50"
                        )}
                    >
                        <SettingsSVG
                            style={{ ...IconStyle, padding: "2px" }}
                            className="icon"
                        />
                        <div className="break-word w-full px-3 py-0 fontGroup-normal">
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
                        <div className="break-word w-full px-3 py-0 fontGroup-normal">
                            Maximize
                        </div>
                    </div>

                    <div
                        onClick={() =>
                            closeMenuAndCall(toggleExpand || toggleMinimize)
                        }
                        tabIndex={0}
                        role="button"
                        className={twMerge(
                            "flex cursor-pointer items-center px-3 py-1.5"
                        )}
                    >
                        {toggleExpand ? (
                            <MaximizeSVG
                                style={{ ...IconStyle, padding: "2px" }}
                                className="icon"
                            />
                        ) : (
                            <MinimizeSVG style={IconStyle} className="icon" />
                        )}
                        <div className="break-word w-full px-3 py-0 fontGroup-normal">
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
                        <div className="break-word w-full px-3 py-0 fontGroup-normal">
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
                        <CloseSVG
                            style={IconStyle}
                            className="icon text-primaryVariant200"
                        />

                        <div className="break-word w-full px-3 py-0 fontGroup-normal">
                            Remove Widget
                        </div>
                    </div>
                    <div className="border-borderLine m-0 h-0 w-[184px] mt-2.5 overflow-hidden border-t border-solid mx-auto" />
                    <div className="flex cursor-pointer items-center p-3 pt-4">
                        <InfoSVG
                            style={{ minWidth: "15px", marginTop: "2.5px" }}
                            className="self-start"
                        />
                        <div className="break-word w-full px-3 py-0 fontGroup-normal">
                            {widgetDescription}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaseContainerMenu;
