import { aeneid, mainnet, StoryClient } from '@story-protocol/core-sdk';
import type { StoryConfig } from '@story-protocol/core-sdk';
import { createPublicClient, createWalletClient, http } from 'viem';
import type { WalletClient } from 'viem';
import type { Chain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import type { Address, Account } from 'viem/accounts';

let storyClient: StoryClient | null = null;
let publicClient: any = null;
let walletClient: WalletClient | null = null;

// Network configuration types
type NetworkType = 'aeneid' | 'mainnet';

interface NetworkConfig {
  rpcProviderUrl: string;
  blockExplorer: string;
  protocolExplorer: string;
  defaultNFTContractAddress: Address | null;
  defaultSPGNFTContractAddress: Address | null;
  chain: Chain;
}

// Network configurations
const networkConfigs: Record<NetworkType, NetworkConfig> = {
  aeneid: {
    rpcProviderUrl: 'https://aeneid.storyrpc.io',
    blockExplorer: 'https://aeneid.storyscan.io',
    protocolExplorer: 'https://aeneid.explorer.story.foundation',
    defaultNFTContractAddress: '0x937bef10ba6fb941ed84b8d249abc76031429a9a' as Address,
    defaultSPGNFTContractAddress: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc' as Address,
    chain: aeneid,
  },
  mainnet: {
    rpcProviderUrl: 'https://mainnet.storyrpc.io',
    blockExplorer: 'https://storyscan.io',
    protocolExplorer: 'https://explorer.story.foundation',
    defaultNFTContractAddress: null,
    defaultSPGNFTContractAddress: '0x98971c660ac20880b60F86Cc3113eBd979eb3aAE' as Address,
    chain: mainnet,
  },
} as const;

const getNetwork = (): NetworkType => {
  const network = import.meta.env.VITE_STORY_NETWORK as NetworkType;
  if (network && !(network in networkConfigs)) {
    throw new Error(`Invalid network: ${network}. Must be one of: ${Object.keys(networkConfigs).join(', ')}`);
  }
  return network || 'aeneid';
};

// Initialize network configuration
export const network = getNetwork();

export const networkInfo = {
  ...networkConfigs[network],
  rpcProviderUrl: import.meta.env.VITE_RPC_PROVIDER_URL || networkConfigs[network].rpcProviderUrl,
};

export const initializeStoryClient = (privateKey?: string) => {
  try {
    let account: Account | undefined;

    if (privateKey) {
      // Validate and format private key
      let formattedPrivateKey = privateKey.trim();

      // Add 0x prefix if not present
      if (!formattedPrivateKey.startsWith("0x")) {
        formattedPrivateKey = `0x${formattedPrivateKey}`;
      }

      // Validate private key format (must be 66 characters: 0x + 64 hex chars)
      if (
        formattedPrivateKey.length !== 66 ||
        !/^0x[a-fA-F0-9]{64}$/.test(formattedPrivateKey)
      ) {
        throw new Error(
          "Invalid private key format. Must be 64 hex characters (32 bytes)"
        );
      }

      // Create account from private key
      account = privateKeyToAccount(formattedPrivateKey as `0x${string}`);
    }

    const config: StoryConfig = {
      account,
      transport: http(networkInfo.rpcProviderUrl),
      chainId: network, // Use the network string ('aeneid' or 'mainnet')
    };

    storyClient = StoryClient.newClient(config);
    
    // Initialize viem clients
    const baseConfig = {
      chain: networkInfo.chain,
      transport: http(networkInfo.rpcProviderUrl),
    } as const;

    publicClient = createPublicClient(baseConfig);

    if (account) {
      walletClient = createWalletClient({
        ...baseConfig,
        account,
      }) as WalletClient;
    }

    console.log(`Story Protocol client initialized for ${network} network`);
    return storyClient;
  } catch (error) {
    console.error("Failed to initialize Story client:", error);
    throw error;
  }
};

export const getStoryClient = () => {
  if (!storyClient) {
    const privateKey = import.meta.env.VITE_STORY_PRIVATE_KEY;
    return initializeStoryClient(privateKey);
  }
  return storyClient;
};

export const getPublicClient = () => {
  if (!publicClient) {
    initializeStoryClient();
  }
  return publicClient;
};

export const getWalletClient = () => {
  if (!walletClient) {
    const privateKey = import.meta.env.VITE_STORY_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key required for wallet client");
    }
    initializeStoryClient(privateKey);
  }
  return walletClient;
};

// Utility function to validate private key format
export const validatePrivateKey = (privateKey: string): boolean => {
  const formatted = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  return formatted.length === 66 && /^0x[a-fA-F0-9]{64}$/.test(formatted);
};

// Export network info and addresses
export { networkConfigs };
export const SPGNFTContractAddress = networkInfo.defaultSPGNFTContractAddress;
export const NFTContractAddress = networkInfo.defaultNFTContractAddress;
