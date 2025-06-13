import { createThirdwebClient, defineChain } from "thirdweb";
import { sepolia, mainnet } from "thirdweb/chains";

// Get Thirdweb client ID from environment variables
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error("VITE_THIRDWEB_CLIENT_ID environment variable is required");
}

// Create Thirdweb client
export const thirdwebClient = createThirdwebClient({
  clientId,
});

// Define Story Protocol Aeneid testnet chain
export const storyTestnet = defineChain({
  id: 1513,
  name: "Story Aeneid Testnet",
  nativeCurrency: {
    name: "IP",
    symbol: "IP",
    decimals: 18,
  },
  rpc: "https://aeneid.storyrpc.io",
  blockExplorers: [
    {
      name: "Aeneid Explorer",
      url: "https://aeneid.explorer.story.foundation",
    },
  ],
});

// Supported chains
export const supportedChains = [mainnet, sepolia, storyTestnet];

// Default chain for Story Protocol
export const DEFAULT_CHAIN = storyTestnet;
