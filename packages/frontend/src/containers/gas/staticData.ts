import { TGasConsumptionDict } from "src/api/types";
import cryptoCom from "src/assets/img/crypto-comLogo.png";
import curve from "src/assets/img/curveLogo.png";
import dodo from "src/assets/img/dodoLogo.png";
import mooniswap from "src/assets/img/mooniswapLogo.png";
import sushi from "src/assets/img/sushiLogo.png";
import uniswap from "src/assets/img/uniswapLogo.png";
import balancer from "src/assets/png/balancer.png";

export const AVG_GAS_USED: TGasConsumptionDict = {
    Curve: {
        NAME: "Curve",
        IMG: curve,
        SWAP: 112845,
        SUPPLY_LIQUIDITY: 170357,
        REMOVE_LIQUIDITY: 120762,
    },
    SushiSwap: {
        NAME: "SushiSwap",
        IMG: sushi,
        SWAP: 139923,
        SUPPLY_LIQUIDITY: 190167,
        REMOVE_LIQUIDITY: 201136,
    },
    Mooniswap: {
        NAME: "Mooniswap",
        IMG: mooniswap,
        SWAP: 149767,
        SUPPLY_LIQUIDITY: 161400,
        REMOVE_LIQUIDITY: 149002,
    },
    "Uniswap V2": {
        NAME: "Uniswap V2",
        IMG: uniswap,
        SWAP: 150735,
        SUPPLY_LIQUIDITY: 419519,
        REMOVE_LIQUIDITY: 175526,
    },
    DODO: {
        NAME: "DODO",
        IMG: dodo,
        SWAP: 157185,
        SUPPLY_LIQUIDITY: 139753,
        REMOVE_LIQUIDITY: 129648,
    },
    "Crypto.com": {
        NAME: "Crypto.com",
        IMG: cryptoCom,
        SWAP: 159489,
        SUPPLY_LIQUIDITY: 148076,
        REMOVE_LIQUIDITY: 170874,
    },
    Balancer: {
        NAME: "Balancer",
        IMG: balancer,
        SWAP: 206765,
        SUPPLY_LIQUIDITY: 285031,
        REMOVE_LIQUIDITY: 130479,
    },
};
