"use client";
import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  Locale,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  rabbyWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  polygonAmoy
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "RainbowKit",
  projectId: "863e8d3a85406255198df03f522f31ce",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [rabbyWallet],
    },
  ],
  chains: [polygonAmoy, mainnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function RainbowProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    // <WagmiConfig config={wagmiConfig}>
    //   <RainbowKitProvider
    //     chains={chains}
    //     appInfo={demoAppInfo}
    //   >
    //     {mounted && children}
    //   </RainbowKitProvider>
    // </WagmiConfig>

    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{mounted && children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
