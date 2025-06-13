import React from "react";
import { ConnectButton } from "thirdweb/react";
import { thirdwebClient, supportedChains } from "../config/web3";

interface WalletButtonProps {
  className?: string;
  showBalance?: boolean;
  compact?: boolean;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  className = "",
  compact = false,
}) => {
  return (
    <div className={`wallet-button-container ${className}`}>
      <ConnectButton
        client={thirdwebClient}
        chains={supportedChains}
        connectButton={{
          label: compact ? "Connect" : "Connect Wallet",
          style: {
            background:
              "linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
            minWidth: compact ? "auto" : "150px",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
          },
        }}
        detailsButton={{
          style: {
            background:
              "linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: "500",
          },
        }}
      />
    </div>
  );
};
