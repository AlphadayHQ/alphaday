import { FC } from "react";
import { FormInput, Pager, ScrollBar } from "@alphaday/ui-kit";
import moment from "moment";
import { useControlledModal } from "src/api/hooks";
import { TCoin, THolding } from "src/api/types";

interface IAddHolding {
    selectedCoin: TCoin;
    setSelectedCoin: React.Dispatch<React.SetStateAction<TCoin | undefined>>;
    holding: THolding | undefined;
    setHolding: React.Dispatch<React.SetStateAction<THolding | undefined>>;
}

const AddHolding: FC<IAddHolding> = ({
    selectedCoin,
    setSelectedCoin,
    holding,
    setHolding,
}) => {
    const { closeActiveModal } = useControlledModal();

    const defaultHolding: THolding = {
        coin: selectedCoin,
        amount: 0,
        date: new Date(),
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHolding((prev) => ({
            ...(prev || defaultHolding),
            amount: parseInt(e.target.value, 10),
        }));
    };
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHolding((prev) => ({
            ...(prev || defaultHolding),
            date: new Date(e.target.value),
        }));
    };

    return (
        <ScrollBar>
            <Pager
                title={
                    <span className="inline-flex items-center">
                        <img
                            className="w-6 h-6 rounded-full mr-2"
                            src={selectedCoin.icon}
                            alt=""
                        />{" "}
                        <span className="text-primaryVariant100 mr-1 font-semibold">
                            {selectedCoin.ticker}
                        </span>{" "}
                        {selectedCoin.name}
                    </span>
                }
                handleClose={closeActiveModal}
                handleBack={() => setSelectedCoin(undefined)}
            />
            <div className="flex flex-col items-center mt-4 mx-4">
                <FormInput
                    type="number"
                    label="Amount"
                    placeholder="Enter amount"
                    value={holding?.amount || 0}
                    onChange={handleAmountChange}
                    name="name"
                    className="outline-none px-4 py-3"
                    min={0}
                />
                <div className="mt-5 w-full">
                    <FormInput
                        type="date"
                        label="Amount"
                        placeholder="Enter date"
                        value={moment(holding?.date).format("YYYY-MM-DD")}
                        onChange={handleDateChange}
                        name="amount"
                        className="outline-none px-4 py-3"
                    />
                </div>
            </div>
            <div className="flex justify-center mt-5">
                <button
                    type="button"
                    className="px-4 py-3 w-full mx-4 bg-accentVariant100 hover:bg-accentVariant200 text-primary  rounded-md fontGroup-highlightSemi cursor-pointer disabled:bg-gray-600 disabled:opacity-30"
                    onClick={() => {}}
                >
                    Add Holding
                </button>
            </div>
        </ScrollBar>
    );
};

export default AddHolding;
