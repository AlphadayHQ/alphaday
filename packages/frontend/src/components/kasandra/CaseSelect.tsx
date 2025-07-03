import { FC } from "react";
import { Select } from "@alphaday/ui-kit";
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
        <TrendUpThinSVG className="w-4 h-4 inline fill-success" />
    ),
    [EPredictionCase.PESSIMISTIC]: (
        <TrendDownThinSVG className="w-4 h-4 inline fill-secondaryOrangeSoda" />
    ),
    [EPredictionCase.BASELINE]: (
        <TrendDownThinSVG className="w-4 h-4 inline fill-secondaryOrangeSoda" />
    ),
    all: (
        <TrendDownThinSVG className="w-4 h-4 inline fill-secondaryOrangeSoda" />
    ),
};

export const CaseSelect: FC<{
    cases: TCase[];
    onSelect: (coinCase: TCase) => void;
    selectedCase: TCase | undefined;
}> = ({ cases, onSelect, selectedCase }) => {
    const options = cases.map((c) => ({
        id: c.id as string,
        name: c.name,
        icon: ICONS[c.id] as React.ReactNode,
    }));

    const handleChange = (option: SingleValue<(typeof options)[0]>) => {
        const selected = cases.find((c) => c.id === option?.id);

        onSelect(selected ?? cases[0]);
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
