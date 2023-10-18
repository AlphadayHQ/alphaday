import { FC } from "react";
import { ScrollBar } from "@alphaday/ui-kit";
import { TZapperNftAsset } from "src/api/services";
import globalMessages from "src/globalMessages";
import CONFIG from "../../../config";
import { TPortfolioNFTDataForAddress } from "../types";
import NftCard from "./NftCard";

const { API_BASE_URL } = CONFIG.API_PROVIDERS.IPFS_GATEWAY;

interface INftList {
    nftData: TPortfolioNFTDataForAddress;
    widgetHeight: number;
    nftsQueryFailed: boolean;
}

const getImage = (data: TZapperNftAsset): string | undefined => {
    const imageMedia = data.token.medias.find(
        (media) => media.type === "image"
    );
    let url;
    if (imageMedia?.type === "image") {
        url = imageMedia.originalUrl;
    }
    if (url?.includes("ipfs://")) {
        const cid = url?.split("ipfs://")?.[1];
        return cid ? `${API_BASE_URL}${String(cid)}` : undefined;
    }
    return url;
};

const NftList: FC<INftList> = ({ nftData, widgetHeight, nftsQueryFailed }) => {
    const nftCards = nftData.items.map((item) => (
        <NftCard
            key={
                item.token.collection.openseaId != null
                    ? `${item.token.collection.openseaId}${item.token.tokenId}`
                    : `${item.token.tokenId}`
            }
            img={getImage(item)}
            name={item.token.name}
            value={
                item.token.estimatedValueEth
                    ? parseFloat(item.token.estimatedValueEth)
                    : undefined
            }
        />
    ));

    const message =
        nftData.items.length === 0 ? (
            <div className="flex justify-center items-center top-[220px] z-[2] !h-[200px] text-primaryVariant100">
                No NFTs found for the wallet(s) provided.
            </div>
        ) : (
            <ScrollBar>
                <div className="p-0 pl-[15px] flex justify-around flex-wrap h-full two-col:px-[15px] two-col:pb-[15px]">
                    {nftCards}
                </div>
            </ScrollBar>
        );

    const error = nftsQueryFailed && (
        <div className="flex justify-center items-center top-[220px] z-[2] !h-[200px] text-primaryVariant100">
            {globalMessages.error.requestFailed("your nfts")}
        </div>
    );

    const height = widgetHeight - 53 - 42 || 600; // 53 & 42 are the heights of the addresses tab and asset switcher respectively

    return (
        <div className="pt-5" style={{ height }}>
            {error || message}
        </div>
    );
};

export default NftList;
