import React, { FC, FormEvent } from "react";
import { Input, Pager, ScrollBar, Spinner } from "@alphaday/ui-kit";
import { useControlledModal } from "src/api/hooks";
import { TCoin } from "src/api/types";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-right.svg";
import { ReactComponent as SearchSVG } from "src/assets/svg/search.svg";

interface ISelectHoldingCoin {
    onScroll: ({ currentTarget }: FormEvent<HTMLElement>) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputValue: string;
    isLoadingCoinsData: boolean;
    coins: TCoin[] | undefined;
    setSelectedCoin: React.Dispatch<React.SetStateAction<TCoin | undefined>>;
}

const SelectHoldingCoin: FC<ISelectHoldingCoin> = ({
    onScroll,
    onInputChange,
    inputValue,
    isLoadingCoinsData,
    coins,
    setSelectedCoin,
}) => {
    const { closeActiveModal } = useControlledModal();

    return (
        <ScrollBar onScroll={onScroll}>
            <Pager title="Add Manually" handleClose={closeActiveModal} />
            <p className="mx-4 fontGroup-highlight">
                Search or select the desired crypto coin that you have in your
                portfolio.
            </p>
            <div className="fontGroup-normal relative w-full">
                <Input
                    onChange={onInputChange}
                    id="widgetlib-search"
                    name="widgetlib-search"
                    placeholder="Search..."
                    height="44px"
                    value={inputValue}
                    className="mx-auto pl-8 text-primary placeholder:text-primaryVariant200 fontGroup-highlight outline-none border-none focus:outline-none focus:border-none bg-backgroundVariant200"
                />
                <SearchSVG
                    className="h-4 w-4 absolute top-3.5 left-5 text-primaryVariant200"
                    aria-hidden="true"
                />
            </div>
            <p className="mx-4 mt-7">Or simply select from the list below.</p>

            <div className="mx-4">
                {isLoadingCoinsData ? (
                    <div className="w-full flex justify-center mt-20">
                        <Spinner />
                    </div>
                ) : (
                    coins?.map((coin) => (
                        <div
                            onClick={() => {
                                setSelectedCoin(coin);
                            }}
                            role="button"
                            tabIndex={0}
                            key={coin.id}
                            className="flex items-center justify-between py-4 border-t border-borderLine cursor-pointer hover:bg-backgroundVariant100"
                        >
                            <div className="flex items-center">
                                <img
                                    src={coin.icon}
                                    alt={coin.name}
                                    className="w-5 h-5"
                                />
                                <span className="ml-3 fontGroup-highlight font-semibold">
                                    {coin.name}
                                </span>
                            </div>
                            <ChevronSVG className="w-5 h-5" />
                        </div>
                    ))
                )}
            </div>
        </ScrollBar>
    );
};

export default SelectHoldingCoin;
