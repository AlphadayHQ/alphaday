import { useCallback } from "react";
import { useHistory as useRRDHistory } from "react-router-dom";
import { EMobileTabRoutePaths } from "src/routes";

export const useHistory = () => {
    const history = useRRDHistory();

    /**
     * we shouldn't need this ideally, but adding a listener
     * ensures route navigation to tabs route paths which is great
     */
    history.listen(() => {});

    const backNavigation = useCallback(() => {
        if (history.length > 0) {
            history.goBack();
        } else {
            history.push(EMobileTabRoutePaths.Superfeed);
        }
    }, [history]);

    return {
        ...history,
        backNavigation,
    };
};
