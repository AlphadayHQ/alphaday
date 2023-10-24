import { FC, memo } from "react";
import { ModuleLoader, CarouselImage, Lightbox } from "@alphaday/ui-kit";
import { TSourceData } from "src/api/types";

interface IVenueMap {
    isLoading: boolean;
    sources: TSourceData[];
}

const VenueMapModule: FC<IVenueMap> = memo(function VenueMapModule({
    sources,
    isLoading,
}) {
    return isLoading ? (
        <ModuleLoader $height="300px" />
    ) : (
        <Lightbox>
            {sources.map(({ source_url, name }, index) => (
                <CarouselImage
                    // eslint-disable-next-line react/no-array-index-key
                    key={String(index)}
                    src={source_url}
                    title={name}
                />
            ))}
        </Lightbox>
    );
});

export default VenueMapModule;
