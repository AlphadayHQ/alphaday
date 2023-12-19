import React, { FC, useState, useCallback } from "react";
import PreviewImage from "src/assets/img/defaultView2x.png";
import { ReactComponent as PinSVG } from "src/assets/svg/pin.svg";
import { ReactComponent as PinnedSVG } from "src/assets/svg/pinned.svg";
import { ReactComponent as EditSVG } from "src/assets/svg/rename.svg";
import { twMerge } from "tailwind-merge";
import { ReactComponent as TrashSVG } from "../../assets/svg/trash.svg";

interface IPreview {
    previewImg: string;
    title: string;
    description?: string;
    padding?: string; // Padding default is 5px.
    pinned?: boolean;
    active?: boolean;
    isAuthenticated?: boolean;
    onClick: () => void;
    onRemove?: () => void;
    onPin?: () => void;
    onEdit?: () => void;
}

export const BoardPreview: FC<IPreview> = ({
    previewImg,
    title,
    description,
    onClick,
    onRemove,
    onPin,
    onEdit,
    isAuthenticated,
    active,
    padding,
    pinned,
    ...restProps
}) => {
    const [pinHovered, setPinHovered] = useState(false);

    const handlePinMouseEnter = useCallback(() => {
        if (isAuthenticated) {
            setPinHovered(true);
        }
    }, [isAuthenticated]);

    const handlePinMouseLeave = useCallback(() => {
        if (isAuthenticated) {
            setPinHovered(false);
        }
    }, [isAuthenticated]);

    const handlePinClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
        (event) => {
            event.stopPropagation();
            onPin?.();
        },
        [onPin]
    );

    const handleRemoveClick: React.MouseEventHandler<HTMLDivElement> =
        useCallback(
            (event) => {
                event.stopPropagation();
                onRemove?.();
            },
            [onRemove]
        );

    const handleEditClick: React.MouseEventHandler<HTMLDivElement> =
        useCallback(
            (event) => {
                event.stopPropagation();
                onEdit?.();
            },
            [onEdit]
        );

    return (
        <div
            {...restProps}
            className="group flex cursor-pointer flex-col items-start"
        >
            <div
                onClick={onClick}
                role="link"
                tabIndex={0}
                className={twMerge(
                    active
                        ? "border-accentVariant100"
                        : "border-primaryVariant200",
                    "bg-background group-hover:border-accentVariant100 flex max-h-[167px] max-w-[250px] items-center justify-center rounded-lg border-[1px] "
                )}
            >
                <div
                    className={twMerge(
                        padding || "p-0",
                        "relative flex h-[110px] w-[154px] items-center justify-center"
                    )}
                >
                    <div
                        className="bg-start h-full w-full rounded-md bg-cover bg-no-repeat"
                        style={{
                            backgroundImage: `url(${
                                previewImg || PreviewImage
                            })`,
                        }}
                    />
                    <div className="absolute bottom-[10%] left-2.5 right-2.5 flex items-center justify-between">
                        {onEdit && (
                            <div
                                title="Edit board"
                                className="bg-backgroundVariant200 border-primaryVariant200 text-primary hover:text-accentVariant100 hover:border-accentVariant100 ml-[5px] flex h-[30px] w-[30px] items-center justify-center rounded-full border"
                                role="button"
                                tabIndex={0}
                                onClick={handleEditClick}
                            >
                                <EditSVG className="h-[15px]" />
                            </div>
                        )}
                        {onRemove && (
                            <div
                                className="bg-backgroundVariant200 border-primaryVariant200 text-accentVariant100 ml-[5px] flex h-[30px] w-[30px] items-center justify-center rounded-full border hover:border-secondaryOrangeSoda hover:text-secondaryOrangeSoda hover:stroke-secondaryOrangeSoda"
                                role="button"
                                tabIndex={0}
                                onClick={handleRemoveClick}
                                title="Remove board"
                            >
                                <TrashSVG className="h-[15px] text-inherit" />
                            </div>
                        )}
                        {onPin && (
                            <div
                                className={twMerge(
                                    "bg-backgroundVariant200 border-primaryVariant200 text-accentVariant100 hover:text-accentVariant100 hover:border-accentVariant100 ml-[5px] flex h-[30px] w-[30px] items-center justify-center rounded-full border",
                                    pinned && "border-accentVariant100",
                                    !isAuthenticated && "cursor-not-allowed"
                                )}
                                role="button"
                                tabIndex={0}
                                onClick={handlePinClick}
                                onMouseEnter={handlePinMouseEnter}
                                onMouseLeave={handlePinMouseLeave}
                                title={
                                    isAuthenticated && pinned
                                        ? "Unpin this board from boards tab"
                                        : "Pin this board to boards tab"
                                }
                            >
                                {pinned || pinHovered ? (
                                    <PinnedSVG />
                                ) : (
                                    <PinSVG />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div
                className={twMerge(
                    active
                        ? "text-primary"
                        : "text-primaryVariant100 group-hover:text-primaryFiltered",
                    "mt-3.5 text-[12px] font-semibold uppercase leading-[14px] tracking-[1.2px]"
                )}
                onClick={onClick}
                role="link"
                tabIndex={0}
            >
                {title}
            </div>
            <p
                className={twMerge(
                    active
                        ? "text-primary"
                        : "text-primaryVariant100 group-hover:text-primaryFiltered",
                    "mt-1.75 text-[11px] leading-[14px] tracking-[0.2px] three-liner"
                )}
            >
                {description}
            </p>
        </div>
    );
};
