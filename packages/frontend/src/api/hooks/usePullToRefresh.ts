import { useState } from "react";
import useEventListener from "src/api/hooks/useEventListener";

export function usePullToRefresh() {
    const [touchStartY, setTouchStartY] = useState(0);
    const [pullToRefreshStatus, setPullToRefreshStatus] = useState<
        "hidden" | "visible"
    >("hidden");

    useEventListener("touchstart", (e) => {
        setTouchStartY(e.touches[0].clientY);
    });

    useEventListener("touchmove", (e) => {
        const touchY = e.touches[0].clientY;
        const touchDiff = touchY - touchStartY;
        if (
            touchDiff > 30 &&
            window.scrollY === 0 &&
            pullToRefreshStatus === "hidden"
        ) {
            setPullToRefreshStatus("visible");
            e.preventDefault();
        }
    });

    useEventListener("touchend", () => {
        if (pullToRefreshStatus === "visible") {
            setPullToRefreshStatus("hidden");
            window.location.reload();
        }
    });

    return pullToRefreshStatus;
}
