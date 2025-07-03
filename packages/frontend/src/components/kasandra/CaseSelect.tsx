import { FC } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { EPredictionCase } from "src/api/types";
import { ReactComponent as TrendDownThinSVG } from "src/assets/svg/trend-down-thin.svg";
import { ReactComponent as TrendUpThinSVG } from "src/assets/svg/trend-up-thin.svg";

// import { ReactComponent as CheckMarkSVG } from "../../assets/svg/checkmark.svg";
// import { ReactComponent as ChevronUpDownSVG } from "../../assets/svg/chevron-up-down.svg";

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

const Option =
    (selectedCase: TCase | undefined) =>
    ({
        data: coinCase,
        innerRef,
        innerProps,
    }: {
        data: TCase;
        innerRef: (instance: HTMLDivElement | null) => void;
        innerProps: JSX.IntrinsicElements["div"];
    }) => (
        <div
            role="button"
            tabIndex={0}
            className="relative flex items-center px-3 py-2 hover:bg-backgroundVariant200 cursor-pointer"
            ref={innerRef}
            {...innerProps}
        >
            {ICONS[coinCase.id]}
            <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                {coinCase.name}
            </span>
            {coinCase.id === selectedCase?.id && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                    {/* <CheckMarkSVG aria-hidden="true" className="size-5" /> */}
                </span>
            )}
        </div>
    );

const IndicatorsContainer = () => (
    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        {/* <ChevronUpDownSVG
            aria-hidden="true"
            className="w-5 stroke-primaryVariant100"
        /> */}
    </div>
);

export const CaseSelect: FC<{
    cases: TCase[];
    onSelect: (coinCase: TCase) => void;
    selectedCase: TCase | undefined;
}> = ({ cases, onSelect, selectedCase }) => {
    const handleChange = (coinCase: SingleValue<TCase>) => {
        const selected = cases.find((c) => c.id === coinCase?.id);

        onSelect(selected ?? cases[0]);
    };

    return (
        <ReactSelect
            unstyled
            isSearchable={false}
            value={selectedCase}
            options={cases}
            onChange={handleChange}
            className="w-full"
            components={{
                Option: Option(selectedCase),
                IndicatorsContainer,
            }}
            classNames={{
                container: () =>
                    "w-full max-w-[180px] hover:bg-backgroundVariant200 rounded-md",
                control: () => "w-full rounded-md",
                menu: () =>
                    "w-full bg-background border border-borderLine shadow-sm rounded-b-md",
                option: () => "w-full",
                singleValue: () => "w-full px-3",
                valueContainer: () => "w-full",
                input: () => "w-full",
                placeholder: () => "w-full",
            }}
            // eslint-disable-next-line react/no-unstable-nested-components
            formatOptionLabel={(coinCase) => (
                <div
                    key={coinCase.id}
                    className="group relative cursor-default text-primary fontGroup-highlightSemi select-none data-focus:text-white data-focus:outline-hidden"
                >
                    <div className="flex items-center">
                        {ICONS[coinCase.id]}
                        <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                            {coinCase.name}
                        </span>
                    </div>
                </div>
            )}
        />
    );
};
