import { createContext, useState, useContext, FC, useCallback } from "react";
import useEventListener from "src/api/hooks/useEventListener";
import { Logger } from "src/api/utils/logging";

const PWAInstallContext = createContext<undefined | (() => void)>(undefined);

const usePWAInstall = () => {
    const [eventRef, setEventRef] = useState<Event | null>(null);

    const handleInstall = useCallback(() => {
        if (eventRef) {
            // @ts-ignore - TODO: fix this type
            eventRef.prompt();
            // @ts-ignore - TODO: fix this type
            eventRef.userChoice.then((choiceResult) => {
                Logger.debug(
                    `PWAInstallProvider::useEventListener: user choice: ${choiceResult.outcome}`
                );
                if (choiceResult.outcome === "accepted") {
                    Logger.debug(
                        "PWAInstallProvider::useEventListener: accepted"
                    );
                } else {
                    Logger.debug(
                        "PWAInstallProvider::useEventListener: dismissed"
                    );
                }
                setEventRef(null);
            });
        }
    }, [eventRef]);

    // @ts-ignore - TODO: fix this type
    useEventListener("beforeinstallprompt", (e) => {
        Logger.debug(
            "PWAInstallProvider::useEventListener: beforeinstallprompt triggered"
        );
        e.preventDefault();
        setEventRef(e);
    });

    return handleInstall;
};

interface PWAInstallProviderProps {
    children?: React.ReactNode;
}

const PWAInstallProvider: FC<PWAInstallProviderProps> = ({ children }) => {
    const value = usePWAInstall();
    return (
        <PWAInstallContext.Provider value={value}>
            {children}
        </PWAInstallContext.Provider>
    );
};

const usePWAInstallContext = () => {
    const handleInstall = usePWAInstall();
    const context = useContext(PWAInstallContext);
    if (context === undefined) {
        return handleInstall;
    }
    return context;
};

export { PWAInstallProvider, usePWAInstallContext };
