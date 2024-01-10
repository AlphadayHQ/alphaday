import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { ReactComponent as PlusSVG } from "../../assets/svg/plus.svg";

interface IPreview {
    previewImg: string;
    title: string;
    description: string;
    padding?: string; // Padding default is 5px. Pass 10px for the twitter module
    selected: boolean;
    onClick: () => void;
    count: number;
    isMaxed: boolean;
}

export const ModulePreview: FC<IPreview> = ({
    previewImg,
    title,
    description,
    onClick,
    count,
    selected,
    isMaxed,
    padding,
}) => {
    return (
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            className=" cursor-pointer flex flex-col items-start"
        >
            <div
                className={twMerge(
                    "flex justify-center items-center max-w-[250px] max-h-[167px] border-[2px_solid] rounded-lg",
                    isMaxed ? "border-btnRingVariant1400" : "border-borderLine",
                    selected && "border-accentVariant100"
                )}
            >
                <div
                    className={twMerge(
                        "relative w-40 three-col:w-60 h-32 three-col:h-[167px] p-[5px] flex justify-center items-center",
                        padding && `p-[${padding}]`
                    )}
                >
                    <div
                        className=" w-full h-full bg-cover bg-left-top bg-no-repeat bg-backgroundVariant200 rounded-md"
                        style={{ backgroundImage: `url(${previewImg})` }}
                    />
                    <div className="absolute bottom-[10%] right-[5%] flex justify-center items-center">
                        {count !== undefined && count > 0 && (
                            <div className="flex justify-center items-center w-5 h-5 bg-accentVariant100 rounded-[10px] text-background text-center fontGroup-highlightSemi">
                                {count}
                            </div>
                        )}
                        <div
                            className={twMerge(
                                "flex justify-center items-center ml-[5px] w-[30px] h-[30px] bg-backgroundVariant200 rounded-full border-[2px_solid] text-primary",
                                count > 0
                                    ? "border-primaryVariant200"
                                    : "border-accentVariant100",
                                isMaxed && "bg-accentVariant100 text-background"
                            )}
                        >
                            <PlusSVG width="13px" />
                        </div>
                    </div>
                </div>
            </div>
            <p className="m-[14px_0_0] text-primary uppercase fontGroup-highlightSemi pr-1">
                {title}
            </p>
            <p className="mt-[7px] fontGroup-normal text-primary pr-1">
                {description}
            </p>
        </div>
    );
};
