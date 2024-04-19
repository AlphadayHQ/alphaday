import { useHistory as useRRDHistory } from "react-router-dom";
import { useControlledModal } from "../store/providers/controlled-modal-provider";

export const useHistory = () => {
    const history = useRRDHistory();
    const { resetModal } = useControlledModal();

    /**
     * we shouldn't need this ideally, but adding a listener
     * ensures route navigation to tabs route paths which is great
     */
    history.listen(() => {
        // reset modal on route change
        resetModal();
    });

    return history;
};
