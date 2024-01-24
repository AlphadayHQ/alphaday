import { FC, useState } from "react";
import { Button, Modal } from "@alphaday/ui-kit";
import { usePWAInstallContext } from "src/api/store/providers/pwa-install-provider";
import { isPWA } from "src/api/utils/helpers";
import { ReactComponent as CloseSVG } from "../../assets/icons/close3.svg";

const InstallPWAContainer: FC = () => {
    const handleInstall = usePWAInstallContext();
    const [showModal, setShowModal] = useState(!isPWA());

    const handleCloseDialog = () => setShowModal(false);

    return (
        <Modal
            size="sm"
            showModal={showModal}
            className="p-8 m-8 rounded-xl"
            onClose={handleCloseDialog}
        >
            <div className="flex justify-end">
                <button
                    onClick={handleCloseDialog}
                    className="flex h-[34px] w-[34px] items-center justify-center -m-4"
                    title="close"
                    type="button"
                    data-testid="alpha-dialog-close-button"
                >
                    <CloseSVG className="h-[8.4px] w-[8.4px] text-borderLine outline-none" />
                </button>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
                <span className="bg-secondaryOrange w-40 h-40 m-5 rounded-full flex flex-col items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100"
                        height="90"
                        viewBox="0 0 100 90"
                        fill="none"
                    >
                        <path
                            d="M78.3896 39.3076C70.5433 52.8963 62.697 66.4849 54.8264 80.0736C53.1451 82.9959 54.1441 86.7461 57.0926 88.4264C60.0166 90.1068 63.7692 89.1083 65.4506 86.1617C68.7889 80.3902 72.1028 74.643 75.4411 68.8714C77.1225 65.9492 80.875 64.9264 83.7991 66.6067C86.7232 68.287 87.7466 72.0373 86.0653 74.9595C83.3361 79.6839 80.607 84.4083 77.8779 89.157C81.9716 89.157 91.2068 90.0337 95.0812 87.8176C99.7841 85.1145 101.392 79.1482 98.6875 74.4482C91.9134 62.7347 85.1637 50.9968 78.3896 39.2833V39.3076ZM37.1114 86.1617C35.4301 89.084 31.6775 90.1068 28.7534 88.4264C25.8293 86.7461 24.8059 82.9959 26.4873 80.0736C30.1667 73.6932 33.8462 67.3129 37.55 60.9326C39.2314 58.0103 38.2323 54.26 35.2839 52.5797C32.3598 50.8994 28.6072 51.8978 26.9259 54.8445C20.3711 66.1683 13.8406 77.5166 7.28582 88.8405C3.09465 87.7202 0 83.8969 0 79.343C0 77.2243 0.682288 75.2518 1.80318 73.6445C15.059 50.7045 28.2661 27.8133 41.4975 4.89766C44.2023 0.197642 50.221 -1.38527 54.8995 1.31785C56.4834 2.24324 57.7018 3.50955 58.5302 4.99505L71.2743 27.0583C59.8704 46.7838 48.4178 66.4849 37.0627 86.1617H37.1114Z"
                            fill="white"
                        />
                    </svg>
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
