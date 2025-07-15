import { FC } from "react";

interface IDisclaimer {
    onAccept: () => void;
    accepted: boolean;
}

const Disclaimer: FC<IDisclaimer> = ({ accepted, onAccept }) => {
    if (accepted) return null;

    return (
        <div className="relative w-full">
            <div className="absolute z-50 top-0 left-0 w-full flex justify-between items-center gap-2 mt-0 bg-backgroundBlue px-3 py-2">
                <p className="fontGroup-normal text-primary mb-0">
                    These are AI-generated predictions.
                </p>
                <button
                    type="button"
                    className="fontGroup-normal text-primary hover:bg-backgroundBlue100 cursor-pointer border border-solid border-primary rounded-md px-2 py-0.5"
                    onClick={onAccept}
                >
                    I understand
                </button>
            </div>
        </div>
    );
};

export default Disclaimer;
