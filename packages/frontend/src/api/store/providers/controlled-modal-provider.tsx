import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import useEventListener from "src/api/hooks/useEventListener";

interface Prop {
    activeModal: string | null;
    setActiveModal: (modalId: string) => void;
    closeActiveModal: () => void;
    resetModalHistory: () => void;
}

export const ControlledModalContext = createContext<Prop>({
    activeModal: null,
    setActiveModal: () => {},
    closeActiveModal: () => {},
    resetModalHistory: () => {},
});

export const useControlledModal = () => {
    const context = useContext(ControlledModalContext);
    if (context === undefined) {
        throw new Error(
            "controlled-modal-context:useControlledModal: not used within a Provider"
        );
    }
    return context;
};

const MODAL_HISTORY = new Set<string>();

const ControlledModalProvider: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const closeActiveModal = useCallback(() => {
        if (activeModal) {
            MODAL_HISTORY.delete(activeModal);
            // set active modal to last modal in history
            const lastModal = Array.from(MODAL_HISTORY).pop();
            setActiveModal(lastModal || null);
        }
    }, [activeModal]);

    const setActiveModalWithHistory = (modalId: string) => {
        if (!MODAL_HISTORY.has(modalId)) {
            setActiveModal(modalId);
            MODAL_HISTORY.add(modalId);
        }
    };

    const resetModalHistory = () => {
        setActiveModal(null);
        MODAL_HISTORY.clear();
    };

    useEventListener("popstate", (e) => {
        /**
         * If there is an active modal,
         * close it when the user swipes back or presses the back button
         */
        if (activeModal) {
            e.preventDefault();
            history.forward();
            closeActiveModal();
        }
    });

    return (
        <ControlledModalContext.Provider
            value={useMemo(
                () => ({
                    activeModal,
                    setActiveModal: setActiveModalWithHistory,
                    closeActiveModal,
                    resetModalHistory,
                }),
                [activeModal, closeActiveModal]
            )}
        >
            {children}
        </ControlledModalContext.Provider>
    );
};

export default ControlledModalProvider;
