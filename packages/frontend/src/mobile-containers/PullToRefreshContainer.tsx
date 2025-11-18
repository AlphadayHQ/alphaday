import { useState, useRef, useEffect } from "react";

interface PullToRefreshContainerProps {
    children: React.ReactNode;
    handleRefresh: () => void;
}

const PullToRefreshContainer: React.FC<PullToRefreshContainerProps> = ({
    children,
    handleRefresh,
}) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [startY, setStartY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const pullMin = 60;
    const pullMax = 200;

    const handleTouchStart = (e: React.TouchEvent) => {
        if (containerRef.current && containerRef.current.scrollTop === 0) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (
            isRefreshing ||
            !containerRef.current ||
            containerRef.current.scrollTop !== 0
        ) {
            return;
        }

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0) {
            const adjustedDistance = Math.min(distance * 0.5, pullMax);
            setPullDistance(adjustedDistance);
        }
    };

    const handleTouchEnd = () => {
        if (pullDistance >= pullMin) {
            setIsRefreshing(true);
            handleRefresh();
            setTimeout(() => {
                setIsRefreshing(false);
                setPullDistance(0);
            }, 1000);
        } else {
            setPullDistance(0);
        }
        setStartY(0);
    };

    useEffect(() => {
        if (isRefreshing) {
            const timer = setTimeout(() => {
                setIsRefreshing(false);
                setPullDistance(0);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isRefreshing]);

    return (
        <div className="relative h-full overflow-hidden">
            {(pullDistance > 0 || isRefreshing) && (
                <div
                    className="absolute top-0 left-0 right-0 flex items-center justify-center transition-transform"
                    style={{
                        transform: `translateY(${pullDistance}px)`,
                        height: `${pullDistance}px`,
                    }}
                >
                    <div
                        className={`w-8 h-8 border-4 border-accentVariant100 border-t-transparent rounded-full ${
                            isRefreshing ? "animate-spin" : ""
                        }`}
                    />
                </div>
            )}
            <div
                ref={containerRef}
                role="feed"
                className="h-full overflow-y-auto overscroll-contain"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition:
                        pullDistance === 0 ? "transform 0.3s ease" : "none",
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default PullToRefreshContainer;
