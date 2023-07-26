import { createContext, FC, useContext, useMemo, useState } from "react";

function useTutorialProviderValue() {
    // Why this should be a state and not a ref https://reactjs.org/docs/refs-and-the-dom.html
    const [tutFocusElemRef, setTutFocusElemRef] = useState<HTMLElement | null>(
        null
    );
    const value = useMemo(
        () => ({
            tutFocusElemRef,
            setTutFocusElemRef,
        }),
        [tutFocusElemRef]
    );
    return value;
}

type Context = ReturnType<typeof useTutorialProviderValue>;

const TutorialContext = createContext<Context | undefined>(undefined);

export const TutorialProvider: FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const value = useTutorialProviderValue();

    return (
        <TutorialContext.Provider value={value}>
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorialContext = (): Context => {
    const context = useContext(TutorialContext);
    if (context === undefined) {
        throw new Error(
            "tutorial-context:useTutorialContext: useContext must be used within a Provider"
        );
    }
    return context;
};
