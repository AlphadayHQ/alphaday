import { useHistory as useRRDHistory } from "react-router-dom";
import { useControlledModal } from "../store/providers/controlled-modal-provider";

export const useHistory = () => {
    const history = useRRDHistory();
    const { resetModalHistory } = useControlledModal();

    history.listen(() => {
        // reset modal on route change
        resetModalHistory();
    });

    return history;
};
