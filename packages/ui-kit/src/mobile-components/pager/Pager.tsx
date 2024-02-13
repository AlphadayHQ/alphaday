import { ReactComponent as ChevronLeftIcon } from "src/assets/svg/chevron-left.svg";
import { ReactComponent as Close3Icon } from "src/assets/svg/close3.svg";

interface PagerProps {
    title?: string;
    handleClose?: () => void;
    handleBack?: () => void;
}

export const Pager: React.FC<PagerProps> = ({
    title,
    handleBack,
    handleClose,
}) => {
    return (
        <div className="w-full flex justify-between items-center px-4 py-5">
            <button
                type="button"
                className="flex flex-grow"
                onClick={handleBack}
            >
                <ChevronLeftIcon />
            </button>
            <div className="flex flex-grow justify-center uppercase font-bold text-base">
                {title}
            </div>
            {handleClose && (
                <button
                    type="button"
                    className="flex flex-grow justify-end"
                    onClick={handleClose}
                >
                    <Close3Icon />
                </button>
            )}
        </div>
    );
};
