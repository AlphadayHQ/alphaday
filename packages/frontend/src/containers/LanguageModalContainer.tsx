import { setSelectedLanguageCode, toggleLanguageModal } from "src/api/store";
import { useAppDispatch, useAppSelector } from "src/api/store/hooks";
import { ELanguageCode } from "src/api/types/language";
import { LanguageModal } from "src/components/LanguageModal";

export const LanguageModalContainer = () => {
    const dispatch = useAppDispatch();
    const showModal = useAppSelector((state) => state.ui.showLanguageModal);
    const selectedCode = useAppSelector(
        (state) => state.ui.selectedLanguageCode
    );
    const toggleModal = () => dispatch(toggleLanguageModal());
    const handleSetLanguageCode = (code: ELanguageCode) => {
        dispatch(setSelectedLanguageCode({ code }));
    };

    const onClose = () => {
        if (showModal) {
            toggleModal();
        }
    };

    return (
        <LanguageModal
            onSetLanguageCode={handleSetLanguageCode}
            selectedCode={selectedCode}
            showModal={showModal}
            onClose={onClose}
        />
    );
};
