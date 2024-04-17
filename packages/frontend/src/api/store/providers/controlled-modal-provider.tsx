import { createContext, useContext, useMemo, useState } from "react";

interface ControlledModalContextProps {
    activeModal: string | null;
    setActiveModal: React.Dispatch<React.SetStateAction<string | null>>;
    closeModal: () => void;
}

export const ControlledModalContext =
    createContext<ControlledModalContextProps>({
        activeModal: null,
        setActiveModal: () => {},
        closeModal: () => {},
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

const ControlledModalProvider: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const closeModal = () => setActiveModal(null);

    return (
        <ControlledModalContext.Provider
            value={useMemo(
                () => ({ activeModal, setActiveModal, closeModal }),
                [activeModal]
            )}
        >
            {children}
        </ControlledModalContext.Provider>
    );
};

export default ControlledModalProvider;
