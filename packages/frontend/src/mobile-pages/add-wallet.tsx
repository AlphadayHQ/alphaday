import { FormInput, NavBottom, Pager } from "@alphaday/ui-kit";
import { useHistory } from "react-router";

const PortfolioPage = () => {
    const history = useHistory();
    return (
        <>
            <Pager
                title="Add wallet address"
                handleClose={() =>
                    history.length > 1 ? history.goBack() : history.push("/")
                }
            />
            <div className="flex flex-col items-center mt-4 mx-4">
                <FormInput
                    type="text"
                    label="Wallet name"
                    placeholder="Enter your wallet name"
                    value=""
                    onChange={() => {}}
                    className="outline-none px-4 py-3"
                />
                <div className="mt-5 w-full">
                    <FormInput
                        type="text"
                        label="Wallet address"
                        placeholder="Enter wallet address"
                        value=""
                        onChange={() => {}}
                        className="outline-none px-4 py-3"
                    />
                </div>
            </div>
            <NavBottom />
        </>
    );
};

export default PortfolioPage;
