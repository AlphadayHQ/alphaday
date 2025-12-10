import { FC, memo, useRef, useState } from "react";
import { CenteredBlock, ModuleLoader } from "@alphaday/ui-kit";
import globalMessages from "src/globalMessages";

interface IImageWidget {
    title: string;
    imageUrl: string;
    imageLink?: string;
    isLoading: boolean;
    showImage: boolean;
    onAspectRatioDetected?: (aspectRatio: number) => void;
}

const ImageWidget: FC<IImageWidget> = memo(function ImageWidget({
    title,
    imageUrl,
    imageLink,
    isLoading,
    showImage,
    onAspectRatioDetected,
}) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const previousImageUrl = useRef(imageUrl);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const aspectRatio = img.naturalWidth / img.naturalHeight;

        if (onAspectRatioDetected && aspectRatio > 0) {
            onAspectRatioDetected(aspectRatio);
        }

        setImageLoading(false);
    };

    if (isLoading) {
        return <ModuleLoader $height="400px" />;
    }

    if (previousImageUrl.current !== imageUrl) {
        setImageLoading(true);
        setImageError(false);
        previousImageUrl.current = imageUrl;
    }

    if (!imageUrl || imageError) {
        return (
            <div style={{ height: "400px" }}>
                <CenteredBlock>
                    <p className="text-primary fontGroup-highlightSemi">
                        {globalMessages.queries.noMatchFound("image")}
                    </p>
                </CenteredBlock>
            </div>
        );
    }

    return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div
            tabIndex={-1}
            className="flex items-center justify-center w-full h-full"
            onClick={() => {
                if (imageLink) {
                    window.open(imageLink, "_blank");
                }
            }}
            style={{ cursor: imageLink ? "pointer" : "default" }}
            role="banner"
        >
            {imageLoading && <ModuleLoader $height="500px" />}
            <img
                src={imageUrl}
                alt={title}
                className={`w-full h-full object-cover rounded ${
                    imageLoading || !showImage ? "hidden" : "block"
                }`}
                onLoad={handleImageLoad}
                onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                }}
            />
        </div>
    );
});

export default ImageWidget;
