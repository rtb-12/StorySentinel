import React from "react";
import { Wallet, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useWallet } from "../hooks/useWallet";

export const WalletStatus: React.FC = () => {
  const {
    isAuthenticated,
    hasWallet,
    isWalletConnected,
    walletAddress,
    balance,
    isCreatingWallet,
  } = useWallet();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <div>
          <p className="text-sm font-medium text-yellow-800">
            Authentication Required
          </p>
          <p className="text-xs text-yellow-600">
            Please sign in to access Web3 features
          </p>
        </div>
      </div>
    );
  }

  if (!hasWallet) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Wallet className="w-5 h-5 text-blue-600" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            {isCreatingWallet ? "Creating Wallet..." : "Wallet Setup Required"}
          </p>
          <p className="text-xs text-blue-600">
            {isCreatingWallet
              ? "Please wait while we create your embedded wallet"
              : "Create an embedded wallet to interact with Story Protocol"}
          </p>
        </div>
        {isCreatingWallet && (
          <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
        )}
      </div>
    );
  }

  if (!isWalletConnected) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-orange-600" />
        <div>
          <p className="text-sm font-medium text-orange-800">
            Wallet Not Connected
          </p>
          <p className="text-xs text-orange-600">
            Connect your wallet to access blockchain features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircle className="w-5 h-5 text-green-600" />
      <div className="flex-1">
        <p className="text-sm font-medium text-green-800">Wallet Connected</p>
        <div className="flex items-center gap-4 text-xs text-green-600">
          <span className="font-mono">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </span>
          {balance && <span>{balance.formatted}</span>}
        </div>
      </div>
    </div>
  );
};
