import { FC, memo } from "react";

const MapModule: FC<{ url: string }> = memo(function MapModule({ url }) {
    return <iframe src={url} className="w-full h-full border-0" />;
});
export default MapModule;
