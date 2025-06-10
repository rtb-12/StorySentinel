import { createConfig, http } from "wagmi";
import { mainnet, sepolia, polygonMumbai } from "wagmi/chains";
import { embeddedWallet } from "@civic/auth-web3/wagmi";

// Story Protocol is built on Ethereum, so we'll include mainnet and testnets
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygonMumbai],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
  },
  connectors: [embeddedWallet()],
});

// Civic Auth configuration
export const CIVIC_CLIENT_ID =
  process.env.REACT_APP_CIVIC_CLIENT_ID ||
  "01eadaaf-2d4d-4c75-9742-4f40e7440fa3";

// Optional auth server for development (not needed for production)
export const AUTH_SERVER =
  process.env.REACT_APP_AUTH_SERVER || "https://auth.civic.com/oauth";
export const WALLET_API_BASE_URL = process.env.REACT_APP_WALLET_API_BASE_URL;

// Default chain for Story Protocol (you'll update this when Story testnet is available)
export const DEFAULT_CHAIN = sepolia;
