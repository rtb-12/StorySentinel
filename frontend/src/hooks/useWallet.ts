import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { useWalletBalance } from "thirdweb/react";
import { thirdwebClient, DEFAULT_CHAIN } from "../config/web3";

export const useWallet = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  const isConnected = !!account && !!wallet;

  // Get wallet balance
  const { data: balance, isLoading: balanceLoading } = useWalletBalance({
    client: thirdwebClient,
    chain: DEFAULT_CHAIN,
    address: account?.address,
  });

  return {
    // Account info
    account,
    wallet,
    address: account?.address,
    isConnected,

    // Balance info
    balance,
    balanceLoading,

    // Actions
    disconnect,

    // Chain info
    chain: DEFAULT_CHAIN,
  };
};
