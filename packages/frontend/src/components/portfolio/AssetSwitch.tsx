import { FC } from "react";
import { Switch } from "@alphaday/ui-kit";
import { EPortfolioType } from "./types";

interface IAssetSwitch {
    switchPortfolioType: () => void;
    portfolioType: EPortfolioType;
}

const AssetSwitch: FC<IAssetSwitch> = ({
    switchPortfolioType,
    portfolioType,
}) => {
    return (
        <div className="m-0 mx-[10px] pt-[15px] h-[42px]">
            <Switch
                options={["Assets", "NFTs"]}
                onChange={switchPortfolioType}
                checked={portfolioType === EPortfolioType.Nft}
            />
        </div>
    );
};

export default AssetSwitch;
