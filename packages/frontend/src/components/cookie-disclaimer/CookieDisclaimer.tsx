import { FC } from "react";
import { Button, Overlay } from "@alphaday/ui-kit";
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
const CookieDisclaimer: FC<IProps> = ({ choices }) => (
    <Overlay
        isVisible
        position="bottom"
        style={{
            zIndex: Z_INDEX_REGISTRY.OVERLAY,
        }}
    >
        <div className="p-2 flex flex-col w-full max-w-screen-lg overflow-hidden items-center lg:(p-5 flex-row)">
            <p className="text-primary mx-auto min-w-[280px] text-center lg:text-left">
                We use essential cookies to make Alphaday work. We&apos;d like
                to use other cookies to improve and personalize your visit and
                to analyze our website&apos;s performance, but only if you
                accept.
            </p>
            <div className="m-2 flex flex-row justify-end items-end transform scale-70 sm:(transform-none) > *:ml-4">
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

export default CookieDisclaimer;
