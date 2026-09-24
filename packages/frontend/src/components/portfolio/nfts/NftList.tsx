import { FC } from "react";
import { ModuleLoader, ScrollBar } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { TNftAsset } from "src/api/services";
import globalMessages from "src/globalMessages";
import CONFIG from "../../../config";
import { TPortfolioNFTDataForAddress } from "../types";
import NftCard from "./NftCard";

const { API_BASE_URL } = CONFIG.API_PROVIDERS.IPFS_GATEWAY;

interface INftList {
    nftData: TPortfolioNFTDataForAddress;
    widgetHeight: number;
    isLoading: boolean;
    nftsQueryFailed: boolean;
}

const getImage = (data: TNftAsset): string | undefined => {
    const imageMedia = data.token.medias.find(
        (media) => media.type === "image"
    );
    // fall back to the collection logo when the token has no image media
    const url = imageMedia?.originalUrl ?? data.token.collection.logoImageUrl;
    if (url?.includes("ipfs://")) {
        const cid = url?.split("ipfs://")?.[1];
        return cid ? `${API_BASE_URL}${String(cid)}` : undefined;
    }
    return url ?? undefined;
};

const NftList: FC<INftList> = ({
    nftData,
    widgetHeight,
    isLoading,
    nftsQueryFailed,
}) => {
    const { t } = useTranslation();
    const nftCards = nftData.items.map((item) => (
        <NftCard
            key={
                item.token.collection.openseaId != null
                    ? `${item.token.collection.openseaId}${item.token.tokenId}`
                    : `${item.token.tokenId}`
            }
            img={getImage(item)}
            name={item.token.name || item.token.tokenId}
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
                {t("messages.noNftsFound")}
            </div>
        ) : (
            <ScrollBar>
                <div className="p-0 pl-4 flex justify-around flex-wrap h-full two-col:px-4 two-col:pb-4">
                    {nftCards}
                </div>
            </ScrollBar>
        );

    const error = nftsQueryFailed && (
        <div className="flex justify-center items-center top-[220px] z-[2] !h-[200px] text-primaryVariant100">
            {globalMessages.error.requestFailed(t("others.yourNfts"))}
        </div>
    );

    const height = widgetHeight - 53 - 42 || 600; // 53 & 42 are the heights of the addresses tab and asset switcher respectively

    if (isLoading) {
        return <ModuleLoader $height={`${String(height)}px`} />;
    }

    return (
        <div className="pt-5" style={{ height }}>
            {error || message}
        </div>
    );
};

export default NftList;
