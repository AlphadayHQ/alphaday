import { FC, memo, useState } from "react";
import { CenteredBlock, ModuleLoader } from "@alphaday/ui-kit";
import globalMessages from "src/globalMessages";

interface IImageWidget {
    title: string;
    imageUrl: string;
    isLoading: boolean;
}

const ImageWidget: FC<IImageWidget> = memo(function ImageWidget({
    title,
    imageUrl,
    isLoading,
}) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

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
                onLoad={() => setImageLoading(false)}
                onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                }}
            />
        </div>
    );
});

export default ImageWidget;
