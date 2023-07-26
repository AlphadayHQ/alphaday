// import { createConfig, configureChains, mainnet } from "@wagmi/core";
import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
} from "@web3modal/ethereum";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config/config";
import { configureChains, createConfig, mainnet } from "wagmi";

const chains = [mainnet];
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
