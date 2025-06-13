import React, { useState } from "react";
import { Wallet, Send, CheckCircle } from "lucide-react";
import {
  useActiveAccount,
  useActiveWallet,
  useSendTransaction,
  useWalletBalance,
} from "thirdweb/react";
import { toEther, toWei, isAddress } from "thirdweb/utils";
import { thirdwebClient, DEFAULT_CHAIN } from "../config/web3";
import { WalletButton } from "./WalletButton";

export const Web3Demo: React.FC = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [ethToSend, setEthToSend] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);

  const isConnected = !!account && !!wallet;

  // Get wallet balance
  const { data: balance, isLoading: balanceLoading } = useWalletBalance({
    client: thirdwebClient,
    chain: DEFAULT_CHAIN,
    address: account?.address,
  });

  // Send transaction hook
  const { mutate: sendTx, isPending: isSending } = useSendTransaction();

  const handleSendTransaction = async () => {
    if (
      !account ||
      !recipientAddress ||
      !ethToSend ||
      !isAddress(recipientAddress)
    ) {
      alert("Please enter a valid recipient address and amount");
      return;
    }

    try {
      const transaction = {
        to: recipientAddress as `0x${string}`,
        value: toWei(ethToSend),
        client: thirdwebClient,
        chain: DEFAULT_CHAIN,
      };

      sendTx(transaction, {
        onSuccess: (result) => {
          setTxHash(result.transactionHash);
          setRecipientAddress("");
          setEthToSend("");
          alert(`Transaction sent! Hash: ${result.transactionHash}`);
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
          alert(`Transaction failed: ${error.message}`);
        },
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      alert("Error preparing transaction");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Web3 Wallet Demo
        </h2>

        {!isConnected ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <Wallet className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connect your wallet to get started with Web3 features
            </p>
            <WalletButton />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Wallet Connected
                </span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                <p>
                  <strong>Address:</strong> {account.address.slice(0, 6)}...
                  {account.address.slice(-4)}
                </p>
                <p>
                  <strong>Wallet:</strong> {wallet.id}
                </p>
                <p>
                  <strong>Chain:</strong> {DEFAULT_CHAIN.name}
                </p>
              </div>
            </div>

            {/* Balance Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wallet Address
                </label>
                <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                  {account.address}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Balance
                </label>
                <p className="text-gray-900 dark:text-white">
                  {balanceLoading
                    ? "Loading..."
                    : balance
                    ? `${toEther(balance.value)} ${balance.symbol}`
                    : "0 ETH"}
                </p>
              </div>
            </div>

            {/* Send Transaction Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Transaction
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {recipientAddress && !isAddress(recipientAddress) && (
                    <p className="text-red-500 text-xs mt-1">
                      Invalid address format
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount ({DEFAULT_CHAIN.nativeCurrency?.symbol || "ETH"})
                  </label>
                  <input
                    type="number"
                    value={ethToSend}
                    onChange={(e) => setEthToSend(e.target.value)}
                    placeholder="0.01"
                    step="0.001"
                    min="0"
                    className="w-full bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSendTransaction}
                  disabled={
                    !recipientAddress ||
                    !ethToSend ||
                    !isAddress(recipientAddress) ||
                    isSending
                  }
                  className={`w-full rounded px-4 py-2 text-white font-medium transition-colors flex items-center justify-center gap-2 ${
                    !recipientAddress ||
                    !ethToSend ||
                    !isAddress(recipientAddress) ||
                    isSending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Transaction
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Transaction History */}
            {txHash && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Recent Transaction
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-mono break-all">
                  {txHash}
                </p>
                <a
                  href={`${DEFAULT_CHAIN.blockExplorers?.[0]?.url}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm underline"
                >
                  View on Explorer →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
