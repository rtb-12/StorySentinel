import { useUser as useCivicUser } from "@civic/auth-web3/react";
import { useAutoConnect } from "@civic/auth-web3/wagmi";
import { userHasWallet } from "@civic/auth-web3";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { useMemo } from "react";

export interface UseWalletReturn {
  // Auth state
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  authStatus: string;

  // Wallet state
  hasWallet: boolean;
  walletAddress?: string;
  isWalletConnected: boolean;
  isCreatingWallet: boolean;
  balance?: { value: bigint; symbol: string; formatted: string };

  // Actions
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  createWallet: () => Promise<void>;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

export const useWallet = (): UseWalletReturn => {
  const userContext = useCivicUser();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Auto-connect when user has wallet
  useAutoConnect();

  const hasWallet = useMemo(() => {
    return userContext.user ? userHasWallet(userContext) : false;
  }, [userContext]);

  const walletAddress = useMemo(() => {
    if (hasWallet && "ethereum" in userContext) {
      return userContext.ethereum.address;
    }
    return address;
  }, [hasWallet, userContext, address]);

  const formattedBalance = useMemo(() => {
    if (!balance) return undefined;

    return {
      value: balance.value,
      symbol: balance.symbol,
      formatted: `${(Number(balance.value) / 1e18).toFixed(4)} ${
        balance.symbol
      }`,
    };
  }, [balance]);

  const createWallet = async () => {
    if (userContext.user && !hasWallet && "createWallet" in userContext) {
      try {
        await userContext.createWallet();
      } catch (error) {
        console.error("Failed to create wallet:", error);
        throw error;
      }
    }
  };

  const connectWallet = () => {
    const civicConnector = connectors.find((c) => c.id === "civic");
    if (civicConnector) {
      connect({ connector: civicConnector });
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return {
    // Auth state
    user: userContext.user,
    isAuthenticated: !!userContext.user,
    isLoading: userContext.isLoading,
    authStatus: userContext.authStatus,

    // Wallet state
    hasWallet,
    walletAddress,
    isWalletConnected: isConnected,
    isCreatingWallet: hasWallet
      ? false
      : "walletCreationInProgress" in userContext
      ? userContext.walletCreationInProgress
      : false,
    balance: formattedBalance,

    // Actions
    signIn: userContext.signIn,
    signOut: userContext.signOut,
    createWallet,
    connectWallet,
    disconnectWallet,
  };
};
