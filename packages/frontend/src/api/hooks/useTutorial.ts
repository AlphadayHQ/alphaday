import { useCallback } from "react";
import { setCurrentTutorialTip, setStoreShowTutorial } from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import { tutorials } from "src/containers/tutorial/staticData";
import { EFeaturesRegistry } from "src/constants";
import { useTutorialContext } from "../store/providers/tutorial-context";
import { ETutorialTipId, TTutorial } from "../types";
import { useFeatureFlags } from "./useFeatureFlags";
import { useViewRoute } from "./useViewRoute";

interface ITutorial {
    showTutorial: boolean | undefined;
    toggleShowTutorial: (b: boolean) => void;
    currentTutorial: TTutorial;
    toggleNextTutorial: () => void;
    tutFocusElemRef: HTMLElement | null;
    setTutFocusElemRef: React.Dispatch<
        React.SetStateAction<HTMLElement | null>
    >;
}

export const useTutorial: () => ITutorial = () => {
    const dispatch = useAppDispatch();
    const { tutFocusElemRef, setTutFocusElemRef } = useTutorialContext();
    const { isFullSize } = useViewRoute();
    const isWalletBoardAllowed = useFeatureFlags(EFeaturesRegistry.WalletBoard);

    const allowedTutorials = isWalletBoardAllowed
        ? tutorials
        : tutorials.filter(
              (tutorial) => tutorial.id !== ETutorialTipId.WalletView
          );

    const { showTutorial, currentTutorialTip: storedTutorialTip } =
        useAppSelector((state) => state.ui.tutorial);
    const currentTutorialTip = allowedTutorials.find(
        (tutorial) => tutorial.id === storedTutorialTip?.id
    );

    /**
     * sets currentTutorialTip to the next tip
     * resets currentTutorialTip to the first tip after
     * the last tip on the list is reached
     *
     * @returns void
     */
    const toggleNextTutorial = () => {
        if (currentTutorialTip !== undefined) {
            const index = allowedTutorials
                .map((object) => object.id)
                .indexOf(currentTutorialTip.id);
            const next =
                typeof index === "number"
                    ? (index + 1) % allowedTutorials.length
                    : 0;

            dispatch(
                setCurrentTutorialTip({ tutorialTip: allowedTutorials[next] })
            );
        }
    };

    const toggleShowTutorial = useCallback(
        (show: boolean) => {
            // Show the comeback tutorial
            if (
                show === false &&
                currentTutorialTip?.id !== ETutorialTipId.ComeBack
            ) {
                dispatch(
                    setCurrentTutorialTip({
                        tutorialTip:
                            allowedTutorials[allowedTutorials.length - 1],
                    })
                );
                return;
            }

            // Reset the currentTutorial and close
            if (
                show === false &&
                currentTutorialTip?.id === ETutorialTipId.ComeBack
            ) {
                dispatch(
                    setCurrentTutorialTip({ tutorialTip: allowedTutorials[0] })
                );
            }

            dispatch(setStoreShowTutorial({ show }));
        },
        [allowedTutorials, currentTutorialTip?.id, dispatch]
    );

    if (currentTutorialTip === undefined) {
        dispatch(setCurrentTutorialTip({ tutorialTip: allowedTutorials[0] }));
    }

    return {
        showTutorial: showTutorial && !isFullSize,
        toggleShowTutorial,
        toggleNextTutorial,
        tutFocusElemRef,
        setTutFocusElemRef,
        currentTutorial: {
            tip: currentTutorialTip,
            pos: tutFocusElemRef
                ? tutFocusElemRef.getBoundingClientRect()
                : undefined,
            indicator: {
                type: currentTutorialTip?.indicatorType,
                // ? Undecided if we would need this
                // action: {
                //     onClick: undefined,
                //     onDrag: undefined,
                // },
            },
            // The last tip doesn't include a count
            tipCount: `${
                currentTutorialTip
                    ? (allowedTutorials.indexOf(currentTutorialTip) as number) +
                      1
                    : 1
            }/${tutorials.length - 1}`,
        },
    };
};
