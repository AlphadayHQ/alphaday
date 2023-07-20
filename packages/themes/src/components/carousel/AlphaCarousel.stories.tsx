import { FC } from "react";
import { AlphaCarousel, AlphaCarouselItem, AlphaCarouselProps } from "./AlphaCarousel";
import { AlphaCarouselImage } from "./AlphaCarouselImage";

export default {
    title: "Widgets/AlphaCarousel",
    component: AlphaCarousel,
    argTypes: {
        images: {
            type: "array",
        },
    },
};

export const SlideItems: FC<AlphaCarouselProps> = (args) => {
    return (
        <AlphaCarousel {...args}>
            <AlphaCarouselItem>Slide 1</AlphaCarouselItem>
            <AlphaCarouselItem>SLide 2</AlphaCarouselItem>
            <AlphaCarouselItem>Slide 3</AlphaCarouselItem>
        </AlphaCarousel>
    );
};

export const SlideImages: FC<AlphaCarouselProps & { images?: string[] }> = ({
    images,
    ...args
}) => {
    return (
        <AlphaCarousel {...args}>
            {images?.map((img, id) => (
                <AlphaCarouselImage
                    key={String(id)}
                    src={img}
                    title={`Image ${id}`}
                />
            ))}
        </AlphaCarousel>
    );
};
