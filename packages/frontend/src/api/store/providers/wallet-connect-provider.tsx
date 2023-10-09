import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
} from "@web3modal/ethereum";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config/config";
import { configureChains, createConfig, mainnet } from "wagmi";
import {
    arbitrum,
    optimism,
    bsc,
    goerli,
    avalanche,
    moonbeam,
    polygon,
    zkSync,
} from "wagmi/chains";

const chains = [
    mainnet,
    arbitrum,
    optimism,
    bsc,
    goerli,
    avalanche,
    moonbeam,
    polygon,
    zkSync,
];
const projectId = CONFIG.WALLET_CONNECT.PROJECT_ID;

if (!projectId) {
    Logger.error("wallet-connect-provider: projectId is undefined");
}

// Wagmi client
const { publicClient, webSocketPublicClient } = configureChains(chains, [
    w3mProvider({ projectId }),
]);
export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
    webSocketPublicClient,
});
export default new EthereumClient(wagmiConfig, chains);
