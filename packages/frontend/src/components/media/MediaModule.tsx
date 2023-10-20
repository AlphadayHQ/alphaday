import { ModuleLoader } from "@alphaday/ui-kit";
import { useState, FC, memo } from "react";
import { ReactComponent as PlaySVG } from "src/assets/alphadayAssets/icons/play.svg";

interface IMedia {
    title: string;
    entryUrl: string;
    isLoading: boolean;
    thumbnail: string;
}

const MediaModule: FC<IMedia> = memo(function MediaModule({
    title,
    entryUrl,
    thumbnail,
    isLoading,
}) {
    const [isPlaying, setPlaying] = useState(!thumbnail); // if there is a thumbnail, we don't want to play/show the video, we'll just show the thumbnail
    return (
        <>
            {isLoading ? (
                <ModuleLoader $height="300px" />
            ) : (
                <div>
                    <iframe
                        src={entryUrl}
                        title={title}
                        allow="autoplay; encrypted-media"
                        className="w-full border-none"
                        style={{ height: isPlaying ? "410px" : 0 }}
                        allowFullScreen
                    />
                    {!isPlaying && thumbnail && (
                        <div
                            className="w-full h-410 border-none opacity-90 relative bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${thumbnail})`,
                            }}
                        >
                            <div className="absolute top-15% right-30% w-250 h-80% cursor-pointer opacity-85 hover:opacity-60">
                                <PlaySVG onClick={() => setPlaying(true)} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
});

export default MediaModule;
