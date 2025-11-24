import { FC, useMemo } from "react";
import { twMerge } from "@alphaday/ui-kit";
import ImageWidget from "./ImageWidget";

interface IImageModule {
    imageUrl: string | undefined;
    title: string;
    contentHeight?: string;
    isLoading: boolean;
    showImage: boolean;
    type?: "one_col_image" | "two_col_image";
    onAspectRatioDetected?: (aspectRatio: number) => void;
}

export const ImageModule: FC<IImageModule> = ({
    imageUrl,
    title,
    contentHeight,
    isLoading,
    showImage,
    type,
    onAspectRatioDetected,
}) => {
    const processedImageUrl = useMemo(() => {
        if (!imageUrl) return "";
        return imageUrl;
    }, [imageUrl]);

    return (
        <div
            className={twMerge(
                "w-full h-full mb-4",
                type === "one_col_image" && "mb-0"
            )}
            style={{ height: contentHeight || "100%" }}
        >
            <ImageWidget
                imageUrl={processedImageUrl}
                title={title}
                isLoading={isLoading}
                onAspectRatioDetected={onAspectRatioDetected}
                showImage={showImage}
            />
        </div>
    );
};
