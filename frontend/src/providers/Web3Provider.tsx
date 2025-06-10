import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { CivicAuthProvider } from "@civic/auth-web3/react";
import {
  wagmiConfig,
  CIVIC_CLIENT_ID,
  DEFAULT_CHAIN,
  AUTH_SERVER,
  WALLET_API_BASE_URL,
} from "../config/web3";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <CivicAuthProvider
          clientId={CIVIC_CLIENT_ID}
          initialChain={DEFAULT_CHAIN}
          config={{ oauthServer: AUTH_SERVER }}
          endpoints={{ wallet: WALLET_API_BASE_URL }}
        >
          {children}
        </CivicAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
