import { FC } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { ReactComponent as CheckMarkSVG } from "../../assets/svg/checkmark.svg";
import { ReactComponent as ChevronUpDownSVG } from "../../assets/svg/chevron-up-down.svg";

type TCoin = {
    id: number;
    name: string;
    slug: string;
    ticker: string;
    icon?: string | undefined;
};

const Option =
    (selectedCoin: TCoin | undefined) =>
    ({
        data: coin,
        innerRef,
        innerProps,
    }: {
        data: TCoin;
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
            <img alt="" src={coin.icon} className="w-5 shrink-0 rounded-full" />
            <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                {coin.name}
            </span>
            {coin.id === selectedCoin?.id && (
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

export const CoinSelect: FC<{
    coins: TCoin[];
    onSelect: (coin: TCoin) => void;
    selectedCoin: TCoin | undefined;
}> = ({ coins, onSelect, selectedCoin }) => {
    const handleChange = (coin: SingleValue<TCoin>) => {
        const selected = coins.find((c) => c.id === coin?.id);

        onSelect(selected ?? coins[0]);
    };

    return (
        <ReactSelect
            unstyled
            isSearchable={false}
            value={selectedCoin}
            options={coins}
            onChange={handleChange}
            className="w-full"
            components={{
                Option: Option(selectedCoin),
                IndicatorsContainer,
            }}
            classNames={{
                container: () =>
                    "w-full max-w-[180px] hover:bg-backgroundVariant200 rounded-md",
                control: () => "w-full rounded-md",
                menu: () =>
                    "w-full bg-background border border-borderLine shadow-sm rounded-md",
                option: () => "w-full",
                singleValue: () => "w-full px-3",
                valueContainer: () => "w-full",
                input: () => "w-full",
                placeholder: () => "w-full",
            }}
            // eslint-disable-next-line react/no-unstable-nested-components
            formatOptionLabel={(coin) => (
                <div
                    key={coin.id}
                    className="group relative cursor-default text-primary fontGroup-highlightSemi select-none data-focus:text-white data-focus:outline-hidden"
                >
                    <div className="flex items-center">
                        <img
                            alt=""
                            src={coin.icon}
                            className="w-5 shrink-0 rounded-full"
                        />
                        <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                            {coin.name}
                        </span>
                    </div>
                </div>
            )}
        />
    );

    // return (
    //     <select title="select" value={selectedCoin?.id} onChange={handleChange}>
    //         <div className="relative mt-2">
    //             <div className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
    //                 <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
    //                     <img
    //                         alt=""
    //                         src={selectedCoin?.icon}
    //                         className="size-5 shrink-0 rounded-full"
    //                     />
    //                     <span className="block truncate">
    //                         {selectedCoin?.name}
    //                     </span>
    //                 </span>
    //                 <ChevronUpDownSVG
    //                     aria-hidden="true"
    //                     className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
    //                 />
    //             </div>

    //             <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm">
    //                 {coins.map((coin) => (
    //                     <option
    //                         key={coin.id}
    //                         value={coin.id}
    //                         className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
    //                     >
    //                         <div className="flex items-center">
    //                             <img
    //                                 alt=""
    //                                 src={coin.icon}
    //                                 className="size-5 shrink-0 rounded-full"
    //                             />
    //                             <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
    //                                 {coin.name}
    //                             </span>
    //                         </div>
    //                     </option>
    //                 ))}
    //             </div>
    //         </div>
    //     </select>
    // );
};
