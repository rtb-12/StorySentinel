import React from "react";
import {
  Wallet,
  User,
  LogIn,
  Loader2,
  Shield,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useWallet } from "../hooks/useWallet";

interface WalletButtonProps {
  className?: string;
  showBalance?: boolean;
  compact?: boolean;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  className = "",
  showBalance = true,
  compact = false,
}) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasWallet,
    walletAddress,
    isWalletConnected,
    isCreatingWallet,
    balance,
    signIn,
    signOut,
    createWallet,
    connectWallet,
  } = useWallet();

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <button
        className={`flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg ${className}`}
        disabled
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        {!compact && <span>Loading...</span>}
      </button>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={signIn}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${className}`}
      >
        <LogIn className="w-4 h-4" />
        {!compact && <span>Sign In</span>}
      </button>
    );
  }

  if (!hasWallet) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <User className="w-4 h-4" />
          {!compact && <span className="text-sm">{user?.name || "User"}</span>}
        </div>
        <button
          onClick={createWallet}
          disabled={isCreatingWallet}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isCreatingWallet ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          {!compact && (
            <span>{isCreatingWallet ? "Creating..." : "Create Wallet"}</span>
          )}
        </button>
      </div>
    );
  }

  if (!isWalletConnected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <User className="w-4 h-4" />
          {!compact && <span className="text-sm">{user?.name || "User"}</span>}
        </div>
        <button
          onClick={connectWallet}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Wallet className="w-4 h-4" />
          {!compact && <span>Connect Wallet</span>}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* User Info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
        <User className="w-4 h-4" />
        {!compact && <span className="text-sm">{user?.name || "User"}</span>}
      </div>

      {/* Wallet Info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-mono text-green-800">
            {formatAddress(walletAddress!)}
          </span>
          <button
            onClick={copyAddress}
            className="p-1 hover:bg-green-100 rounded text-green-600 transition-colors"
            title="Copy address"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Balance */}
      {showBalance && balance && !compact && (
        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-800">{balance.formatted}</span>
        </div>
      )}

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        title="Sign out"
      >
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
};
