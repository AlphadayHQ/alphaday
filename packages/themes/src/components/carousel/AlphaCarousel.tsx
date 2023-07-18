import {
    FC,
    Children,
    ReactNode,
    useEffect,
    useState,
    useCallback,
} from "react";
import { ReactComponent as PointerSVG } from "src/assets/svg/pointer.svg";
import { twMerge } from "tailwind-merge";
import { Z_INDEX_REGISTRY } from "../../utils/zIndexRegistry";

enum ECarouselPagination {
    Next = 1,
    Previous = -1,
}

export interface AlphaCarouselProps {
    speed?: number;
    startIndex?: number;
    showDots?: boolean;
    showPointers?: boolean;
    children: ReactNode;
    onItemClick?: (index: number) => void;
}

export const AlphaCarouselItem: FC<{ children: ReactNode }> = ({ children }) => (
    <div className="inline-flex h-min flex-col items-center justify-center">
        {children}
    </div>
);
 
export const AlphaCarousel: FC<AlphaCarouselProps> = ({
    children,
    speed = 3000,
    showDots,
    showPointers = true,
    onItemClick,
    startIndex = 0,
}) => {
    const [index, setIndex] = useState(startIndex);
    const [paused, setPaused] = useState(false);
    const count = Children.count(children);

    const updateIndex = useCallback(
        (diff = ECarouselPagination.Next) => {
            setIndex((prevIndex) => {
                return (prevIndex + diff + count) % count;
            });
        },
        [count]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            if (!paused && speed > 0) {
                updateIndex();
            }
        }, speed);

        return () => {
            clearInterval(interval);
        };
    }, [paused, speed, updateIndex]);

    return (
        <div
            className="overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {showPointers && count > 1 && (
                <div
                    className={twMerge(
                        `z-[${Z_INDEX_REGISTRY.CAROUSEL}]`,
                        "top-2/5 absolute left-0 scale-x-[-1] cursor-pointer opacity-60 hover:opacity-100"
                    )}
                >
                    <PointerSVG
                        width="50px"
                        height="50px"
                        onClick={() =>
                            updateIndex(ECarouselPagination.Previous)
                        }
                    />
                </div>
            )}
            <div
                className="whitespace-nowrap transition-transform duration-300"
                role="button"
                tabIndex={0}
                onClick={() => onItemClick?.(index)}
            >
                {children}
            </div>
            {showPointers && count > 1 && (
                <div
                    className={twMerge(
                        `z-[${Z_INDEX_REGISTRY.CAROUSEL}]`,
                        "top-2/5 absolute left-[calc(100%-50px)] right-0 cursor-pointer opacity-60 hover:opacity-100"
                    )}
                >
                    <PointerSVG
                        width="50px"
                        height="50px"
                        onClick={() => updateIndex(ECarouselPagination.Next)}
                    />
                </div>
            )}
            {showDots && count > 1 && (
                <div className="flex items-center justify-center py-2">
                    {Array(count)
                        .fill(null)
                        .map((_, i) => (
                            <div
                                key={String(i)}
                                className={twMerge(
                                    index === i ? "bg-primary" : "bg-primaryVariant700",
                                    "bg-border hover:bg-primary mx-1 h-2 w-2 cursor-pointer rounded-full transition-colors duration-300"
                                )}
                                onClick={() => {
                                    setIndex(i);
                                }}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};
