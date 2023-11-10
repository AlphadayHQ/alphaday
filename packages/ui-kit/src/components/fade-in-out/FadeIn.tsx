import { useState, useEffect, FC } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
    children: React.ReactNode;
    delay?: number;
};

export const FadeIn: FC<Props> = ({ children, delay = 500 }) => {
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsHidden(false);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={twMerge(
                "transition-opacity duration-500 opacity-100",
                isHidden && "opacity-0 pointer-events-none"
            )}
        >
            {children}
        </div>
    );
};
