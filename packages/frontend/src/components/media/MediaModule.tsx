import { FC, memo, useEffect, useRef } from "react";
import { CenteredBlock, ModuleLoader } from "@alphaday/ui-kit";
import globalMessages from "src/globalMessages";

interface IMedia {
    title: string;
    entryUrl: string;
    isLoading: boolean;
    isVertical?: boolean;
}

const FRAME_HEIGHT = 410;
// width that preserves a 9:16 ratio at the fixed frame height
const VERTICAL_FRAME_WIDTH = Math.round((FRAME_HEIGHT * 9) / 16);

const MediaModule: FC<IMedia> = memo(function MediaModule({
    title,
    entryUrl,
    isLoading,
    isVertical = false,
}) {
    /**
     * Before the iframe loads the browser displays a white page.
     * For that reason we set its visibility to hidden until it loads
     */
    const frameRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // in case onLoad didn't fire, check visibility after some time
            if (frameRef.current?.style?.visibility === "hidden") {
                frameRef.current.style.visibility = "visible";
            }
        }, 60 * 1000);
        return () => clearTimeout(timeout);
    }, []);

    if (isLoading) {
        return <ModuleLoader $height={`${FRAME_HEIGHT}px`} />;
    }

    if (entryUrl) {
        return (
            <div className="h-full flex items-center justify-center two-col:contents">
                <iframe
                    src={entryUrl}
                    title={title}
                    allow="autoplay; encrypted-media"
                    className={
                        isVertical ? "border-none" : "w-full border-none"
                    }
                    style={{
                        height: `${FRAME_HEIGHT}px`,
                        width: isVertical
                            ? `${VERTICAL_FRAME_WIDTH}px`
                            : undefined,
                        visibility: "hidden",
                    }}
                    allowFullScreen
                    ref={frameRef}
                    onLoad={() => {
                        if (frameRef.current) {
                            frameRef.current.style.visibility = "visible";
                        }
                    }}
                />
            </div>
        );
    }
    return (
        <div className="h-[410px]">
            <CenteredBlock>
                <p className="text-primary fontGroup-highlightSemi">
                    {globalMessages.queries.noMatchFound("video")}
                </p>
            </CenteredBlock>
        </div>
    );
});

export default MediaModule;
