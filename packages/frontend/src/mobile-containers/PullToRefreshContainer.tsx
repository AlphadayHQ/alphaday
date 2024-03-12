import { Spinner } from "@alphaday/ui-kit";
import { usePullToRefresh } from "src/api/hooks";

const PullToRefreshContainer = () => {
    const status = usePullToRefresh();

    return (
        status === "visible" && (
            <div className="flex justify-center m-8 z-[1000] text-center">
                <span className="flex justify-center bg-backgroundFiltered p-3 rounded-full">
                    <Spinner />
                </span>
            </div>
        )
    );
};

export default PullToRefreshContainer;
