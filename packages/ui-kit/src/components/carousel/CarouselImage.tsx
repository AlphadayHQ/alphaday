import { FC, useCallback, useRef } from "react";
import QuickPinchZoom, {
    make3dTransformValue,
    UpdateAction,
} from "react-quick-pinch-zoom";
import { CarouselItem } from "./Carousel";

interface CarouselImageProps {
    src: string;
    title: string;
}
export const CarouselImage: FC<CarouselImageProps> = ({ src, title }) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const onUpdate = useCallback(({ x, y, scale }: UpdateAction) => {
        const { current: img } = imgRef;

        if (img) {
            const value = make3dTransformValue({ x, y, scale });

            img.style.setProperty("transform", value);
        }
    }, []);

    return (
        <CarouselItem>
            <QuickPinchZoom onUpdate={onUpdate}>
                <img alt={title} className="w-full" ref={imgRef} src={src} />
            </QuickPinchZoom>
            <div className="w-full pt-2 text-center font-extrabold">
                {title}
            </div>
        </CarouselItem>
    );
};
