import { toggleShowWidgetLib } from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";

interface IWidgetLib {
    showWidgetLib: boolean;
    toggleWidgetLib: () => void;
}

export const useWidgetLib: () => IWidgetLib = () => {
    const dispatch = useAppDispatch();

    const showWidgetLib = useAppSelector((state) => state.ui.showWidgetLib);

    const toggleWidgetLib = () => dispatch(toggleShowWidgetLib());

    return {
        showWidgetLib,
        toggleWidgetLib,
    };
};
