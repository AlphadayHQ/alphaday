import { FC, useCallback, useRef } from "react";
import QuickPinchZoom, {
    make3dTransformValue,
    UpdateAction,
} from "react-quick-pinch-zoom";
import { AlphaCarouselItem } from "./AlphaCarousel";

interface AlphaCarouselImageProps {
    src: string;
    title: string;
}
export const AlphaCarouselImage: FC<AlphaCarouselImageProps> = ({
    src,
    title,
}) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const onUpdate = useCallback(({ x, y, scale }: UpdateAction) => {
        const { current: img } = imgRef;

        if (img) {
            const value = make3dTransformValue({ x, y, scale });

            img.style.setProperty("transform", value);
        }
    }, []);

    return (
        <AlphaCarouselItem>
            <QuickPinchZoom onUpdate={onUpdate}>
                <img alt="image" className="w-full" ref={imgRef} src={src} />
            </QuickPinchZoom>
            <div className="w-full pt-2 text-center font-extrabold">
                {title}
            </div>
        </AlphaCarouselItem>
    );
};
