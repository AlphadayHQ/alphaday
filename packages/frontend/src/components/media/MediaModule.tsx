import { FC, memo, useEffect, useRef } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";

interface IMedia {
    title: string;
    entryUrl: string;
    isLoading: boolean;
}

const MediaModule: FC<IMedia> = memo(function MediaModule({
    title,
    entryUrl,
    isLoading,
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

    return isLoading ? (
        <ModuleLoader $height="300px" />
    ) : (
        <iframe
            src={entryUrl}
            title={title}
            allow="autoplay; encrypted-media"
            className="w-full border-none"
            style={{
                height: "410px",
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
    );
});

export default MediaModule;
