import { FC } from "react";
import { Pager, ScrollBar } from "@alphaday/ui-kit";
import { useHistory } from "react-router";
import { TCoin } from "src/api/types";

interface IAddHolding {
    selectedCoin: TCoin;
}

const AddHolding: FC<IAddHolding> = ({ selectedCoin }) => {
    const history = useHistory();

    return (
        <ScrollBar>
            <Pager
                title={`${selectedCoin.ticker} ${selectedCoin.name}`}
                handleClose={() =>
                    history.length > 1 ? history.goBack() : history.push("/")
                }
            />
        </ScrollBar>
    );
};

export default AddHolding;
