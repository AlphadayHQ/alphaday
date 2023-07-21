import { SUPPORTED_EVM_NETWORKS } from "src/config/thirdparty";
import { TPortfolio } from "../types";

export const getAssetPrefix = (a: TPortfolio): string => {
    const networks = SUPPORTED_EVM_NETWORKS;

    if (a.network === "ethereum") return "";
    const prefix: string =
        networks[a.network.toLowerCase() as keyof typeof networks].abbrev;
    return `(${prefix})`;
};
