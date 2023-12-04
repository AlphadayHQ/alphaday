import { FC, useMemo } from "react";
import { useLayer } from "react-laag";
import { ReactComponent as InfoSVG } from "src/assets/svg/info.svg";
import { ReactComponent as MoreSVG } from "src/assets/svg/more-kebab.svg";
import { ReactComponent as PinSVG } from "src/assets/svg/pin.svg";
import { ReactComponent as PinnedSVG } from "src/assets/svg/pinned.svg";
import { ReactComponent as EditSVG } from "src/assets/svg/rename.svg";
import { ReactComponent as ShareSVG } from "src/assets/svg/share.svg";
import { ReactComponent as TrashSVG } from "src/assets/svg/trash.svg";

import { themeColors } from "src/globalStyles/themes";
import { twMerge } from "tailwind-merge";

type TMenuIcon = "trash" | "share" | "pin" | "pinned" | "edit";

const renderIcon = (icon: TMenuIcon) => {
    switch (icon) {
        case "trash":
            return <TrashSVG className="icon" />;
        case "share":
            return (
                <ShareSVG
                    style={{ fill: themeColors.primaryVariant100 }}
                    className="icon"
                />
            );
        case "pin":
            return <PinSVG className="icon" />;
        case "pinned":
            return <PinnedSVG className="icon" />;
        case "edit":
            return <EditSVG className="icon" />;
        default:
            return null;
    }
};

export type TViewTabMenuOption = {
    handler: (() => void) | undefined;
    icon: TMenuIcon;
    title: string;
    key: string;
};

interface IViewTabMenu {
    options: TViewTabMenuOption[];
    menuDescription?: string;
    showMenu: boolean;
    onToggleMenu: (val?: boolean) => void;
}
export const ViewTabMenu: FC<IViewTabMenu> = ({
    options,
    menuDescription,
    showMenu,
    onToggleMenu,
}) => {
    const { renderLayer, triggerProps, layerProps } = useLayer({
        isOpen: showMenu,
        placement: "bottom-end",
        auto: true,
        triggerOffset: 6,
        onOutsideClick: () => {
            onToggleMenu(false);
        },
    });

    const styledLayerProps = useMemo(
        () => ({
            ...layerProps,
            style: {
                ...layerProps.style,
                width: "200px",
                marginTop: "7px",
                background: themeColors.background,
                color: themeColors.primary,
                border: `1px solid ${themeColors.btnRingVariant500}`,
                boxShadow: `0px 0px 35px 9px ${themeColors.backgroundVariant1700}`,
                borderRadius: `5px`,
                zIndex: 9, // TODO (xavier-charles): use ZIndex Registry
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

    const closeMenuAndCall = (callback: (() => void) | undefined) => {
        if (callback) {
            callback();
            onToggleMenu(false);
        }
    };

    return (
        <div className="absolute right-1.5">
            <div
                className="fill-primaryVariant100 cursor-pointer flex items-center self-center"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleMenu();
                }}
                title="Open/Close Menu"
                role="button"
                tabIndex={0}
                {...triggerProps}
            >
                <div className="flex  items-center relative">
                    <MoreSVG className="w-full h-full max-w-[20px] max-h-5 ml-[15%]" />
                </div>
            </div>
            {renderLayer(
                <div {...styledLayerProps}>
                    {options.map((option) => (
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                if (option.handler) {
                                    closeMenuAndCall(option.handler);
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            key={option.key}
                            className={twMerge(
                                "p-[10px] flex items-center cursor-pointer hover:bg-background [&:nth-child(1)]:rounded-[5px_5px_0_0] [&:nth-last-child(1)]:rounded-[0_0)5px_5px] [&:nth-last-child(1)]:flex [&:nth-last-child(1)]:items-start [&:nth-last-child(1)]:cursor-default [&>svg]:text-primaryVariant100 [&>svg]:w-[17px] [&>svg]:h-[17px] [&>svg]:p-0.5",
                                option.handler === undefined &&
                                    "opacity-50 hover:bg-transparent cursor-not-allowed"
                            )}
                        >
                            {renderIcon(option.icon)}
                            <div className="py-0 px-3 break-word w-full">
                                {option.title}
                            </div>
                        </span>
                    ))}
                    {menuDescription && (
                        <>
                            <div className="h-0 hidden border-t border-borderLine m-0 w-[200px]" />
                            <span className="description +++++++++">
                                <InfoSVG
                                    style={{
                                        minWidth: "15px",
                                        marginTop: "2.5px",
                                    }}
                                    className="icon"
                                />
                                <div className="py-0 px-3 break-word w-full">
                                    {menuDescription}
                                </div>
                            </span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
