import { FC, useEffect } from "react";
// import { breakpoints } from "@alphaday/shared/styled";
import { useAvailableViews /* useWindowSize */ } from "src/api/hooks";
import { useTutorial } from "src/api/hooks/useTutorial";
// import Tutorial from "src/components/tutorial/Tutorial";
import CONFIG from "src/config/config";

const TutorialContainer: FC = () => {
    // const windowSize = useWindowSize();
    const availableViews = useAvailableViews();
    const {
        showTutorial,
        // currentTutorial,
        // toggleNextTutorial,
        // tutFocusElemRef,
        toggleShowTutorial,
    } = useTutorial();

    // we don't want to show tutorial on mobile
    // const isMobile = windowSize.width < breakpoints[2];

    useEffect(() => {
        /**
         * Delay tutorial for 5 seconds for new users.
         * Sometimes the api call to get views is slow.
         */
        let timeout: NodeJS.Timeout;
        if (!CONFIG.IS_TEST && showTutorial === undefined) {
            timeout = setTimeout(() => {
                toggleShowTutorial(true);
            }, CONFIG.UI.TUTORIAL_DELAY);
        }
        return () => {
            clearTimeout(timeout);
        };
        // Should only run when availableViews is not undefined
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableViews !== undefined]);

    // if (!isMobile && showTutorial && tutFocusElemRef) {
    //     return (
    //         <Tutorial
    //             closeTutorial={() => {
    //                 toggleShowTutorial(false);
    //             }}
    //             tutorial={currentTutorial}
    //             toggleNextTutorial={toggleNextTutorial}
    //             tutFocusElemRef={tutFocusElemRef}
    //         />
    //     );
    // }
    return null;
};

export default TutorialContainer;
