import { FC, useMemo } from "react";
import ImageWidget from "./ImageWidget";

interface IImageModule {
    imageUrl: string | undefined;
    title: string;
    isLoading: boolean;
    isError: boolean;
}

export const ImageModule: FC<IImageModule> = ({
    imageUrl,
    title,
    isLoading,
    isError,
}) => {
    const processedImageUrl = useMemo(() => {
        if (isError || !imageUrl) return "";
        return imageUrl;
    }, [imageUrl, isError]);

    return (
        <div className="w-full h-full">
            <ImageWidget
                imageUrl={processedImageUrl}
                title={title}
                isLoading={isLoading}
            />
        </div>
    );
};
