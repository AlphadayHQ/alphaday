import { toggleAboutModal } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { AboutUsModal } from "src/components/AboutUsModal";

export const AboutUsModalContainer = () => {
    const dispatch = useAppDispatch();
    const showModal = useAppSelector((state) => state.ui.showAboutModal);
    const toggleModal = () => dispatch(toggleAboutModal());

    const onClose = () => {
        if (showModal) {
            toggleModal();
        }
    };

    return <AboutUsModal showModal={showModal} onClose={onClose} />;
};
