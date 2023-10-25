import aaveLogo from "../../assets/img/aaveLogo.png";
import compoundLogo from "../../assets/img/compoundLogo.png";
import convexLogo from "../../assets/img/convexLogo.png";
import curveLogo from "../../assets/img/curveLogo.png";
import ethLogo from "../../assets/img/ethLogo_1.png";
import instadappLogo from "../../assets/img/instadappLogo.png";
import liquityLogo from "../../assets/img/liquityLogo.png";
import makerLogo from "../../assets/img/makerLogo.png";
import sushiLogo from "../../assets/img/sushiLogo.png";
import synthetixLogo from "../../assets/img/synthetixLogo.png";
import uniswapLogo from "../../assets/img/uniswapLogo.png";
import balancerLogo from "../../assets/png/balancer.png";
import bancorLogo from "../../assets/png/bancor.jpeg";
import yearnLogo from "../../assets/png/yearn.png";

export type IProjects =
    | "Aave"
    | "Maker"
    | "Curve Finance"
    | "InstaDApp"
    | "Compound"
    | "Uniswap"
    | "Convex Finance"
    | "SushiSwap"
    | "yearn.finance"
    | "Liquity"
    | "Balancer"
    | "Synthetix"
    | "Bancor"
    | "Ethereum"
    | "Unknown";

export const PROJECTS_LOGO_KEYS: IProjects[] = [
    "Aave",
    "Maker",
    "Curve Finance",
    "InstaDApp",
    "Compound",
    "Uniswap",
    "Convex Finance",
    "SushiSwap",
    "yearn.finance",
    "Liquity",
    "Balancer",
    "Synthetix",
    "Bancor",
    "Ethereum",
    "Unknown",
];

export const PROJECTS_LIST = {
    Aave: { id: 22, name: "Aave" },
    Maker: { id: 0, name: "Maker" },
    "Curve Finance": { id: 33, name: "Curve Finance" },
    InstaDApp: { id: 13, name: "InstaDApp" },
    Compound: { id: 1, name: "Compound" },
    Uniswap: { id: 2, name: "Uniswap" },
    "Convex Finance": { id: 119, name: "Convex Finance" },
    SushiSwap: { id: 43, name: "SushiSwap" },
    "yearn.finance": { id: 36, name: "yearn.finance" },
    Liquity: { id: 94, name: "Liquity" },
    Balancer: { id: 28, name: "Balancer" },
    Synthetix: { id: 12, name: "Synthetix" },
    Bancor: { id: 14, name: "Bancor" },
};

export const PROJECTS_LOGO_MAPPING = {
    Aave: aaveLogo,
    Maker: makerLogo,
    "Curve Finance": curveLogo,
    InstaDApp: instadappLogo,
    Compound: compoundLogo,
    Uniswap: uniswapLogo,
    "Convex Finance": convexLogo,
    SushiSwap: sushiLogo,
    "yearn.finance": yearnLogo,
    Liquity: liquityLogo,
    Balancer: balancerLogo,
    Synthetix: synthetixLogo,
    Bancor: bancorLogo,
    Ethereum: ethLogo,
    Unknown: ethLogo,
};
