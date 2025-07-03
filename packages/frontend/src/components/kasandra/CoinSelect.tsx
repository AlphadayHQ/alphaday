import { FC } from "react";
import { Select } from "@alphaday/ui-kit";
import { SingleValue } from "react-select";
import { TCoin } from "src/api/types";

export const CoinSelect: FC<{
    coins: TCoin[];
    onSelect: (coin: TCoin) => void;
    selectedCoin: TCoin | undefined;
}> = ({ coins, onSelect, selectedCoin }) => {
    const options = coins.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        icon: (
            <img alt="" src={c.icon} className="w-5 shrink-0 rounded-full" />
        ) as React.ReactNode,
    }));

    const handleChange = (option: SingleValue<(typeof options)[0]>) => {
        const selected = coins.find((c) => c.id.toString() === option?.id);

        onSelect(selected ?? coins[0]);
    };

    const selectedOption = options.find(
        (c) => c.id === selectedCoin?.id.toString()
    );

    return (
        <Select
            options={options}
            selectedOption={selectedOption}
            onChange={handleChange}
        />
    );
};
