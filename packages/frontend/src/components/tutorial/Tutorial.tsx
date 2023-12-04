import { FC } from "react";
import { twMerge, Button, FadeIn } from "@alphaday/ui-kit";
import {
    ETutorialIndicatorType,
    ETutorialTipId,
    TTutorial,
} from "src/api/types";
import CONFIG from "src/config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

interface ITutorialItem {
    tutorial: TTutorial;
    closeTutorial: () => void;
    toggleNextTutorial: () => void;
}
const TutorialItem: FC<ITutorialItem> = ({
    tutorial: { tip, pos, tipCount, indicator },
    closeTutorial,
    toggleNextTutorial,
}) => {
    return (
        <div
            tabIndex={-1}
            role="button"
            className="fixed top-0 w-full h-[100vh]"
            data-testid="tutorial-wrapper"
            onClick={closeTutorial}
            style={{ zIndex: Z_INDEX_REGISTRY.TUTORIAL_MODAL }}
        >
            <div className="fixed top-0 w-full h-full bg-background opacity-70" />
            {tip && pos && (
                <FadeIn
                    // Key to rerender between tips instead of using state.
                    key={tip.id}
                    delay={300}
                >
                    <div
                        className="h-[350px] relative bg-transparent flex flex-col items-center"
                        style={{
                            top: pos.y,
                            left: pos.x,
                            width: pos.width,
                        }}
                    >
                        <div
                            className={twMerge(
                                "bg-transparent mb-[20px] animate-pulse border-[3px] border-btnRingVariant400 rounded-full",
                                tip.id === ETutorialTipId.ComeBack &&
                                    "border-primaryVariant100",
                                indicator.type ===
                                    ETutorialIndicatorType.Rect && "rounded"
                            )}
                            style={{
                                height: pos.height,
                                width:
                                    indicator.type ===
                                    ETutorialIndicatorType.Rect
                                        ? pos.width
                                        : pos.height,
                            }}
                        />
                        <div
                            className={twMerge(
                                tip?.align === "left" && "self-start",
                                tip?.align === "right" && "self-end"
                            )}
                        >
                            <div
                                className="bg-primary w-[360px] flex flex-col justify-between rounded-[5px] p-[30px] text-background"
                                onClick={(e) => e.stopPropagation()}
                                role="button"
                                tabIndex={0}
                            >
                                {tip?.title && (
                                    <div className="flex justify-between mb-[15px] fontGroup-highlightSemi uppercase">
                                        <span>{tip.title}</span>
                                        <span>{tipCount}</span>
                                    </div>
                                )}
                                <span>{tip?.text}</span>
                            </div>
                            <div
                                className="w-[360px] flex mt-[6px] justify-center gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                                role="button"
                                tabIndex={0}
                            >
                                {tip.id !== ETutorialTipId.ComeBack && (
                                    <>
                                        <Button
                                            onClick={closeTutorial}
                                            variant="secondary"
                                            className="border-none bg-primaryVariant200 p-[4px_12px_5px] h-[26px] fontGroup-normal"
                                        >
                                            Not Now
                                        </Button>
                                        <Button
                                            onClick={toggleNextTutorial}
                                            variant="secondary"
                                            className="bg-primaryVariant900 p-[4px_12px_5px] h-[26px] fontGroup-normal"
                                        >
                                            Next
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </FadeIn>
            )}
        </div>
    );
};

export default TutorialItem;
