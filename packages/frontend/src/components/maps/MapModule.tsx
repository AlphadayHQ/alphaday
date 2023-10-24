import { FC, memo } from "react";

const MapModule: FC<{ url: string; title?: string }> = memo(function MapModule({
    url,
    title,
}) {
    return (
        <iframe src={url} className="w-full h-[500px] border-0" title={title} />
    );
});
export default MapModule;
