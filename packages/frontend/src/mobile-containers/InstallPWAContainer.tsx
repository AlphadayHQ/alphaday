import { FC, useCallback, useState } from "react";
import { Button, Modal } from "@alphaday/ui-kit";
import { useIsMobile } from "src/api/hooks/useIsMobile";
import { setLastInstallPromptTimestamp } from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import { usePWAInstallContext } from "src/api/store/providers/pwa-install-provider";
import { isPWA } from "src/api/utils/helpers";
import CONFIG from "src/config";
import { ReactComponent as CloseSVG } from "../assets/icons/close3.svg";
import { ReactComponent as LogoShadowSVG } from "../assets/icons/logo-shadow.svg";

/**
 * Check if the time has elapsed
 *
 * @param timestamp
 */
const hasTimeElapsed = (timestamp: number) => {
    const now = Date.now();
    const timeElapsed = now - timestamp;
    const timeInterval = CONFIG.IS_LOCAL ? 3600 : 86400 * 7; // 1 week or 1 hour in dev
    return timeElapsed > timeInterval * 1000;
};

const InstallPWAContainer: FC = () => {
    const dispatch = useAppDispatch();
    const handleInstall = usePWAInstallContext();
    const isMobile = useIsMobile();
    const [showModal, setShowModal] = useState(!isPWA());
    const lastInstallPromptTimestamp = useAppSelector(
        (state) => state.ui.mobile.lastInstallPromptTimestamp
    );

    const handleCloseDialog = useCallback(() => {
        dispatch(setLastInstallPromptTimestamp(Date.now()));
        setShowModal(false);
    }, [dispatch]);

    return (
        <Modal
            size="sm"
            showModal={
                isMobile &&
                showModal &&
                (!lastInstallPromptTimestamp ||
                    hasTimeElapsed(lastInstallPromptTimestamp))
            }
            className="p-8 m-8 rounded-xl"
            onClose={handleCloseDialog}
        >
            <div className="flex justify-end">
                <button
                    onClick={handleCloseDialog}
                    className="flex items-center justify-center -m-3.5 -mt-7"
                    title="close"
                    type="button"
                    data-testid="alpha-dialog-close-button"
                >
                    <CloseSVG className="h-4 w-4 text-primary outline-none" />
                </button>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
                <span className="bg-secondaryOrange w-40 h-40 m-5 rounded-full flex flex-col items-center justify-center">
                    <LogoShadowSVG />
                </span>
                <p className="m-4 text-base font-semibold text-center">
                    Add Alphaday to your Home screen
                </p>
                <Button
                    className="w-full bg-secondaryOrange border-secondaryOrange text-base font-semibold p-3 h-fit"
                    onClick={handleInstall}
                >
                    Install
                </Button>
            </div>
        </Modal>
    );
};

export default InstallPWAContainer;
