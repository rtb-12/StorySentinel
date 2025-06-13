import React from "react";
import { Wallet, CheckCircle, AlertCircle, Activity } from "lucide-react";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";

export const WalletStatus: React.FC = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  const isConnected = !!account && !!wallet;

  return (
    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 hover:bg-white hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`p-2 rounded-lg ${
            isConnected
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gray-100"
          }`}
        >
          <Wallet
            className={`h-4 w-4 ${
              isConnected ? "text-white" : "text-gray-500"
            }`}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">Wallet Status</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-700 font-medium">
                Connected
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">Disconnected</span>
            </>
          )}
        </div>

        {isConnected && (
          <div className="space-y-2">
            <div className="bg-gray-50/70 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">
                <strong>Address:</strong>
              </div>
              <div className="text-xs font-mono text-gray-900 break-all">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </div>
            </div>
            <div className="bg-gray-50/70 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">
                <strong>Wallet:</strong>
              </div>
              <div className="text-xs text-gray-900 capitalize">
                {wallet.id}
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 pt-2">
              <Activity className="h-3 w-3 text-green-500 animate-pulse" />
              <span className="text-xs text-green-600">Active</span>
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="text-center pt-2">
            <div className="text-xs text-gray-500 mb-3">
              Connect your wallet to access Web3 features
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full">
              <div className="w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
