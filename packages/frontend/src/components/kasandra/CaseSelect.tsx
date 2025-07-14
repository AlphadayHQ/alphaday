import { FC } from "react";
import { Select } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { SingleValue } from "react-select";
import { EPredictionCase } from "src/api/types";
import { ReactComponent as TrendDownThinSVG } from "src/assets/svg/trend-down-thin.svg";
import { ReactComponent as TrendUpThinSVG } from "src/assets/svg/trend-up-thin.svg";

export type TCase = {
    id: EPredictionCase | "all";
    name: string;
};

const ICONS = {
    [EPredictionCase.OPTIMISTIC]: (
        <div className="flex items-center w-6 h-6 p-1 pl-0.5 shrink-0 rounded-full bg-[#6DD230]/20">
            <TrendUpThinSVG className="w-5 h-5 inline fill-success" />
        </div>
    ),
    [EPredictionCase.PESSIMISTIC]: (
        <div className="flex items-center w-6 h-6 p-1 pl-0.5 shrink-0 rounded-full bg-[#F45532]/20">
            <TrendDownThinSVG className="w-5 h-5 inline fill-secondaryOrangeSoda" />
        </div>
    ),
    [EPredictionCase.BASELINE]: (
        <div className="flex items-center w-6 h-6 pl-0.5 shrink-0 rounded-full bg-[#FAA202]/20">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="w-5 h-5 inline stroke-secondaryOrange"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14"
                />
            </svg>
        </div>
    ),
    all: (
        <div className="flex items-center w-6 h-6 p-0.5 shrink-0 rounded-full bg-[#84899a]/30">
            <svg
                className="w-5 h-5 inline stroke-[#84899a]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
        </div>
    ),
};

const cases: {
    id: string;
    name: string;
    icon: JSX.Element;
}[] = [
    { id: "all", name: "All Cases", icon: ICONS.all },
    { id: EPredictionCase.OPTIMISTIC, name: "Bullish", icon: ICONS.optimistic },
    {
        id: EPredictionCase.PESSIMISTIC,
        name: "Bearish",
        icon: ICONS.pessimistic,
    },
    { id: EPredictionCase.BASELINE, name: "Neutral", icon: ICONS.baseline },
];

export const CaseSelect: FC<{
    onSelect: (coinCase: TCase) => void;
    selectedCase: TCase | undefined;
}> = ({ onSelect, selectedCase }) => {
    const { t } = useTranslation();

    const options = cases.map((c) => ({
        id: c.id,
        name: t(`kasandra.${c.id}`),
        icon: c.icon as React.ReactNode,
    }));

    const handleChange = (option: SingleValue<(typeof options)[0]>) => {
        const selected = cases.find((c) => c.id === option?.id) || cases[0];

        onSelect({
            id: selected?.id as EPredictionCase | "all",
            name: selected?.name,
        });
    };

    const selectedOption = options.find((c) => c.id === selectedCase?.id);

    return (
        <Select
            options={options}
            selectedOption={selectedOption}
            onChange={handleChange}
        />
    );
};
