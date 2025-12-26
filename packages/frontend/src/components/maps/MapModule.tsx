import { FC, memo } from "react";

const MapModule: FC<{ url: string; title?: string; height?: number }> = memo(
    function MapModule({ url, title, height }) {
        return (
            <iframe
                src={url}
                className="w-full h-[500px] border-0"
                title={title}
                style={{
                    height: `${height ?? 500}px`,
                }}
            />
        );
    }
);
export default MapModule;
