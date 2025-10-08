import { FC, useMemo } from "react";
import ImageWidget from "./ImageWidget";

interface IImageModule {
    imageUrl: string | undefined;
    title: string;
    contentHeight?: string;
    isLoading: boolean;
    onAspectRatioDetected?: (aspectRatio: number) => void;
}

export const ImageModule: FC<IImageModule> = ({
    imageUrl,
    title,
    contentHeight,
    isLoading,
    onAspectRatioDetected,
}) => {
    const processedImageUrl = useMemo(() => {
        if (!imageUrl) return "";
        return imageUrl;
    }, [imageUrl]);

    return (
        <div
            className="w-full h-full mb-4"
            style={{ height: contentHeight || "100%" }}
        >
            <ImageWidget
                imageUrl={processedImageUrl}
                title={title}
                isLoading={isLoading}
                onAspectRatioDetected={onAspectRatioDetected}
            />
        </div>
    );
};
