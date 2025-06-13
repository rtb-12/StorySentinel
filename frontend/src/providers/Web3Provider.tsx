import React from "react";
import { ThirdwebProvider } from "thirdweb/react";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};
