import { useState } from "react";
import { Input, Pager } from "@alphaday/ui-kit";
import { useHistory } from "react-router";
import { ReactComponent as SearchSVG } from "src/assets/svg/search.svg";

const AddHoldingPage = () => {
    const history = useHistory();

    const [searchText, setSearchText] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    return (
        <>
            <Pager
                title="Add Manually"
                handleClose={() =>
                    history.length > 1 ? history.goBack() : history.push("/")
                }
            />
            <p className="mx-4 fontGroup-highlight">
                Search or select the desired crypto coin that you have in your
                portfolio.
            </p>
            <div className="fontGroup-normal relative w-full">
                <Input
                    onChange={handleChange}
                    id="widgetlib-search"
                    name="widgetlib-search"
                    placeholder="Search..."
                    height="44px"
                    value={searchText}
                    className="mx-auto pl-8 text-primary placeholder:text-primaryVariant200 fontGroup-highlight outline-none border-none focus:outline-none focus:border-none bg-backgroundVariant200"
                />
                <SearchSVG
                    className="h-4 w-4 absolute top-3.5 left-5 text-primaryVariant200"
                    aria-hidden="true"
                />
            </div>
            <p className="mx-4 mt-7">Or simply select from the list below.</p>
        </>
    );
};

export default AddHoldingPage;
