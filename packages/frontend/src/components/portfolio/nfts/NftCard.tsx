import { FC, useCallback, useState } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { formatNumber } from "src/api/utils/format";
import { ReactComponent as NoImageSVG } from "src/assets/icons/no-image.svg";

interface INft {
    img: string | undefined;
    name: string;
    value: number | undefined;
}

const NftCard: FC<INft> = ({ img, name, value }) => {
    const [imgLoadFailed, setImgLoadFailed] = useState(false);
    const [videoLoadFailed, setVideoLoadFailed] = useState(false);

    const renderImage = useCallback(() => {
        if (img && !videoLoadFailed) {
            if (!imgLoadFailed) {
                return (
                    <img
                        src={img}
                        onError={() => setImgLoadFailed(true)}
                        className="m-0 p-0 w-full object-cover rounded-md"
                        alt={name}
                    />
                );
            }
            return (
                <video className="img" onError={() => setVideoLoadFailed(true)}>
                    <source src={img} />
                    <track kind="captions" label="English" />
                </video>
            );
        }
        return (
            <NoImageSVG className="m-0 absolute top-[50%] translate-y-[50%] w-[100px] h-[100px] pb-[20%] text-primary" />
        );
    }, [img, imgLoadFailed, name, videoLoadFailed]);

    return (
        <div className="flex m-[5px]">
            <div className="relative w-[130px] h-[160px] my-0 mx-auto bg-background rounded-md two-col:w-[150px] two-col:h-[200px]">
                <div className="absolute bottom-0 left-0 w-full h-full flex justify-center transition-all duration-500 box-border overflow-hidden hover:[filter:brightness(1.1)]">
                    {renderImage()}
                </div>
                <div className="absolute bottom-0 left-0 w-full flex transition-all duration-500 flex-col items-start justify-start h-10 p-2 rounded-t-[3px] rounded-b-md hover:[filter:brightness(1.1)] hover:h-[50px] bg-backgroundVariant1800">
                    <div className="flex justify-between w-full">
                        <span
                            className={twMerge(
                                "fontGroup-normal whitespace-nowrap !overflow-hidden text-ellipsis self-end",
                                !value === undefined ? "w-[85px]" : "w-full"
                            )}
                        >
                            #{name}
                        </span>
                        {value && (
                            <div
                                className="flex flex-col items-end"
                                title="Value in Eth"
                            >
                                <span className="leading-none fontGroup-mini whitespace-nowrap two-col:inline-block">
                                    Est. value
                                </span>
                                <p className="whitespace-nowrap fontGroup-highlight two-col:whitespace-normal">
                                    Ξ {formatNumber({ value }).value}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NftCard;
