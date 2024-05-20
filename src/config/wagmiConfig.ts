import { http, createConfig } from '@wagmi/core'
import { mainnet, polygonAmoy, sepolia } from '@wagmi/core/chains'

export const config = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
    [mainnet.id]: http()
  },
})