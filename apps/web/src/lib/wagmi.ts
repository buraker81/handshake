import { createConfig, createStorage, cookieStorage, http } from "wagmi"
import { avalancheFuji } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

export const wagmiConfig = createConfig({
  chains: [avalancheFuji],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [
    injected(),
    walletConnect({
      projectId:
        process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "dev-placeholder",
    }),
  ],
  transports: {
    [avalancheFuji.id]: http(),
  },
})
