"use client";
import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { rabbyWallet } from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { wallets } = getDefaultWallets();

export const config = getDefaultConfig({
  appName: "RainbowKit",
  projectId: "863e8d3a85406255198df03f522f31ce",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [rabbyWallet],
    },
  ],
  chains: [polygonAmoy],
  ssr: true,
});

const queryClient = new QueryClient();

export function RainbowProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{mounted && children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
