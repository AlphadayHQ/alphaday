import { FC, memo, useState } from "react";
import { CenteredBlock, ModuleLoader } from "@alphaday/ui-kit";
import globalMessages from "src/globalMessages";

interface IImageWidget {
    title: string;
    imageUrl: string;
    isLoading: boolean;
    onAspectRatioDetected?: (aspectRatio: number) => void;
}

const ImageWidget: FC<IImageWidget> = memo(function ImageWidget({
    title,
    imageUrl,
    isLoading,
    onAspectRatioDetected,
}) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        console.log(
            "aspectRatio",
            aspectRatio,
            "naturalWidth",
            img.naturalWidth,
            "naturalHeight",
            img.naturalHeight
        );

        if (onAspectRatioDetected && aspectRatio > 0) {
            onAspectRatioDetected(aspectRatio);
        }

        setImageLoading(false);
    };

    if (isLoading) {
        return <ModuleLoader $height="400px" />;
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
        <div className="flex items-center justify-center w-full h-full">
            {imageLoading && <ModuleLoader $height="500px" />}
            <img
                src={imageUrl}
                alt={title}
                className={`w-full h-full object-cover rounded ${
                    imageLoading ? "hidden" : "block"
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
