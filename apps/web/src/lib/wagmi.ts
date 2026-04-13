import { createConfig, createStorage, cookieStorage, http } from "wagmi"
import { avalancheFuji } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

// walletConnect initializes @walletconnect/sign-client eagerly (accesses indexedDB).
// Guard against SSR by only creating browser-only connectors on the client.
const connectors =
  typeof window !== "undefined"
    ? [
        injected(),
        walletConnect({
          projectId:
            process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "dev-placeholder",
        }),
      ]
    : []

export const wagmiConfig = createConfig({
  chains: [avalancheFuji],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors,
  transports: {
    [avalancheFuji.id]: http(),
  },
})
