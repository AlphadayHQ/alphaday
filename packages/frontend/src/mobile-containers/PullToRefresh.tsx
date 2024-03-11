import { usePullToRefresh } from "src/api/hooks";

const PullToRefreshContainer = () => {
    const status = usePullToRefresh();

    return <div>{status}</div>;
};

export default PullToRefreshContainer;
