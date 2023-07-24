import { FC } from "react";
import { twMerge } from "tailwind-merge";

export interface IFeedback {
    state?: "success" | "warning" | "error";
    showState?: boolean;
    showErrorOnly?: boolean;
    children?: React.ReactNode;
}

const getFeedbackClasses = ({
    state,
    showState,
    showErrorOnly,
}: Omit<IFeedback, "children">) => {
    let classes = "";

    if (state !== "error" && showErrorOnly) {
        classes += "hidden ";
    }

    if (state === "success" && showState && !showErrorOnly) {
        classes += "text-success ";
    }

    if (state === "warning" && showState && !showErrorOnly) {
        classes += "text-warning ";
    }

    if (state === "error" && showState && showErrorOnly) {
        classes += "text-danger ";
    }

    return classes;
};

const Feedback: FC<IFeedback> = ({
    state,
    showState,
    showErrorOnly,
    children,
}) => {
    return (
        <div
            className={twMerge(
                getFeedbackClasses({ state, showState, showErrorOnly }),
                "mt-1 w-full text-sm"
            )}
        >
            {children}
        </div>
    );
};

export default Feedback;
