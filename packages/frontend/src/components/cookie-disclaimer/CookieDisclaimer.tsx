import { FC } from "react";
import { Button, Overlay } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import CONFIG from "src/config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

export type TCookieChoiceProps = {
    key: number;
    buttonText: string;
    isReject?: boolean;
    handler: () => void;
    sortOrder: number;
};

interface IProps {
    choices: Array<TCookieChoiceProps>;
}
const CookieDisclaimer: FC<IProps> = ({ choices }) => {
    const { t } = useTranslation();
    return (
        <Overlay
            isVisible
            position="bottom"
            style={{
                zIndex: Z_INDEX_REGISTRY.OVERLAY,
            }}
        >
            <div className="p-2 flex flex-col w-full max-w-screen-three-col overflow-hidden items-center three-col:p-5 three-col:flex-row">
                <p className="text-primary mx-auto min-w-[280px] text-center three-col:text-left">
                    {t("others.cookie.text")}
                </p>
                <div className="m-2 flex flex-row justify-end items-end transform scale-[70px] two-col:transform-none [&_*]:ml-4">
                    {choices
                        .sort((a, d) => a.sortOrder - d.sortOrder)
                        .map((item) => (
                            <Button
                                key={item.key}
                                onClick={item.handler}
                                variant="primaryXL"
                                error={item.isReject}
                            >
                                {item.buttonText}
                            </Button>
                        ))}
                </div>
            </div>
        </Overlay>
    );
};

export default CookieDisclaimer;
