import { FC, useCallback, useState } from "react";
import { Button, Modal } from "@alphaday/ui-kit";
import { useIsMobile } from "src/api/hooks/useIsMobile";
import { setLastInstallPrompt } from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import { usePWAInstallContext } from "src/api/store/providers/pwa-install-provider";
import { isPWA } from "src/api/utils/helpers";
import { ReactComponent as CloseSVG } from "../../assets/icons/close3.svg";
import { ReactComponent as LogoShadowSVG } from "../../assets/icons/logo-shadow.svg";

const InstallPWAContainer: FC = () => {
    const dispatch = useAppDispatch();
    const handleInstall = usePWAInstallContext();
    const isMobile = useIsMobile();
    const [showModal, setShowModal] = useState(!isPWA());
    const lastInstallPrompt = useAppSelector(
        (state) => state.ui.mobile.lastInstallPrompt
    );

    const handleCloseDialog = useCallback(() => {
        dispatch(setLastInstallPrompt(Date.now()));
        setShowModal(false);
    }, [dispatch]);

    return (
        <Modal
            size="sm"
            showModal={
                isMobile &&
                showModal &&
                (!lastInstallPrompt ||
                    lastInstallPrompt > Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days
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
