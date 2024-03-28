import { useCallback, useMemo } from "react";
import { useHistory as useRRDHistory, useLocation } from "react-router-dom";
import { EMobileTabRoutePaths } from "src/routes";

export const useHistory = () => {
    const history = useRRDHistory();
    const location = useLocation();
    const isNonTabPage = useMemo(() => {
        return (
            history.length > 0 &&
            !Object.keys(EMobileTabRoutePaths)[
                Object.values(EMobileTabRoutePaths).indexOf(
                    location.pathname as EMobileTabRoutePaths
                )
            ]
        );
    }, [history, location]);

    /**
     * we shouldn't need this ideally, but adding a listener
     * ensures route navigation to tabs route paths which is great
     */
    history.listen(() => {});

    const backNavigation = useCallback(() => {
        if (history.length > 0 && isNonTabPage) {
            history.goBack();
        } else if (isNonTabPage) {
            history.push(EMobileTabRoutePaths.Superfeed);
        }
    }, [history, isNonTabPage]);

    return {
        ...history,
        isNonTabPage,
        backNavigation,
    };
};
