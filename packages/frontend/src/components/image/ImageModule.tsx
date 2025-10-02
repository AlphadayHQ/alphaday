import { FC, useMemo } from "react";
import ImageWidget from "./ImageWidget";

interface IImageModule {
    imageUrl: string | undefined;
    title: string;
    contentHeight: string;
    isLoading: boolean;
}

export const ImageModule: FC<IImageModule> = ({
    imageUrl,
    title,
    contentHeight,
    isLoading,
}) => {
    const processedImageUrl = useMemo(() => {
        if (!imageUrl) return "";
        return imageUrl;
    }, [imageUrl]);

    return (
        <div className="w-full h-full" style={{ height: contentHeight }}>
            <ImageWidget
                imageUrl={processedImageUrl}
                title={title}
                isLoading={isLoading}
            />
        </div>
    );
};
