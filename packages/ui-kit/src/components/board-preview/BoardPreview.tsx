import React, { FC, useState, useCallback } from "react";
// import { validateEthAddr } from "src/api/utils/accountUtils";
// import { truncateWithEllipsis } from "src/api/utils/textUtils";
// import { EToastRole, toast } from "src/api/utils/toastUtils";
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
            if (isAuthenticated) {
                onPin?.();
            } else {
                // toast("Sign up to pin boards and enjoy more customizations", {
                //     type: EToastRole.Error,
                // });
            }
        },
        [isAuthenticated, onPin]
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

    const boardTitle = title;
    // validateEthAddr(title)
    // ? truncateWithEllipsis(title, 10)
    // : title;

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
                        ? "border-btnRingVariant100"
                        : "border-primaryVariant200",
                    "bg-backgroundVariant500 group-hover:border-btnRingVariant100 flex max-h-[167px] max-w-[250px] items-center justify-center rounded-lg border-[1px] "
                )}
            >
                <div
                    className={twMerge(
                        padding || "p-[5px]",
                        "relative flex h-[110px] w-[154px] items-center justify-center"
                    )}
                >
                    <img
                        alt="preview"
                        className="bg-start h-full w-full rounded-md bg-cover bg-no-repeat"
                        src={previewImg || PreviewImage}
                        style={{
                            backgroundImage: `url(${
                                previewImg || PreviewImage
                            })`,
                        }}
                    />
                    <div className="absolute bottom-10 left-5 right-5 flex items-center justify-between">
                        {onEdit && (
                            <div
                                title="Edit board"
                                className="bg-btnBackgroundVariant100 border-primaryVariant200 text-primary hover:text-btnRingVariant100 hover:border-btnRingVariant100 ml-[5px] flex h-[30px] w-[30px] items-center justify-center rounded-full border"
                                role="button"
                                tabIndex={0}
                                onClick={handleEditClick}
                            >
                                <EditSVG className="h-[15px]" />
                            </div>
                        )}
                        <div
                            className={
                                onRemove
                                    ? "hover:border-danger hover:text-danger"
                                    : "placeholder"
                            }
                            role="button"
                            tabIndex={0}
                            onClick={handleRemoveClick}
                        >
                            {onRemove && <TrashSVG className="h-[15px]" />}
                        </div>
                        {onPin && (
                            <div
                                className={twMerge(
                                    "border-btnRingVariant100 text-btnRingVariant100",
                                    isAuthenticated && "cursor-not-allowed"
                                )}
                                role="button"
                                tabIndex={0}
                                onClick={handlePinClick}
                                onMouseEnter={handlePinMouseEnter}
                                onMouseLeave={handlePinMouseLeave}
                                title={
                                    isAuthenticated && restProps.pinned
                                        ? "Unpin this board from boards tab"
                                        : "Pin this board to boards tab"
                                }
                            >
                                {restProps.pinned || pinHovered ? (
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
                className="text-primary group-hover:text-primaryVariant800 mt-3.5 text-[12px]
                 font-semibold uppercase leading-[14px] tracking-[1.2px]"
                onClick={onClick}
                role="link"
                tabIndex={0}
            >
                {boardTitle}
            </div>
            <p className="text-primary mt-1.75 group-hover:text-primaryVariant800 text-[11px] font-normal leading-[14px] tracking-[0.2px]">
                {description}
            </p>
        </div>
    );
};
