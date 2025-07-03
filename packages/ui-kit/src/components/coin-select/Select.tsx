import ReactSelect, { SingleValue } from "react-select";
import { ReactComponent as CheckMarkSVG } from "../../assets/svg/checkmark.svg";
import { ReactComponent as ChevronUpDownSVG } from "../../assets/svg/chevron-up-down.svg";

type TSelect = { id: string; name: string; icon: React.ReactNode };
const Option =
    (selectedOption: TSelect | undefined) =>
    ({
        data: coin,
        innerRef,
        innerProps,
    }: {
        data: TSelect;
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
            {coin.icon}
            <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                {coin.name}
            </span>
            {coin.id === selectedOption?.id && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                    <CheckMarkSVG aria-hidden="true" className="size-5" />
                </span>
            )}
        </div>
    );

const IndicatorsContainer = () => (
    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        <ChevronUpDownSVG
            aria-hidden="true"
            className="w-5 stroke-primaryVariant100"
        />
    </div>
);

export const Select = ({
    options,
    selectedOption,
    onChange,
}: {
    options: TSelect[];
    selectedOption: TSelect | undefined;
    onChange: (option: SingleValue<TSelect>) => void;
}) => {
    return (
        <ReactSelect
            unstyled
            isSearchable={false}
            value={selectedOption ?? options[0]}
            options={options}
            onChange={onChange}
            className="w-full"
            components={{
                Option: Option(selectedOption),
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
            formatOptionLabel={(option) => (
                <div
                    key={option.id}
                    className="group relative cursor-default text-primary fontGroup-highlightSemi select-none data-focus:text-white data-focus:outline-hidden"
                >
                    <div className="flex items-center">
                        {option.icon}
                        <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                            {option.name}
                        </span>
                    </div>
                </div>
            )}
        />
    );
};
