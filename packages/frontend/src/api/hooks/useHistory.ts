import { useMemo } from "react";
import { useHistory as useRRDHistory } from "react-router-dom";
import { EMobileTabRoutePaths } from "src/routes";

export const useHistory = () => {
    const history = useRRDHistory();
    const currentPathName = history.location.pathname as EMobileTabRoutePaths;
    const isNonTabPage = useMemo(() => {
        return (
            history.length > 0 &&
            !!Object.keys(EMobileTabRoutePaths)[
                Object.values(EMobileTabRoutePaths).indexOf(currentPathName)
            ]
        );
    }, [history, currentPathName]);

    const backNavigation = () => {
        if (history.length > 0 && !isNonTabPage) {
            history.goBack();
        } else {
            history.push("/");
        }
    };

    return {
        ...history,
        isNonTabPage,
        backNavigation,
    };
};
