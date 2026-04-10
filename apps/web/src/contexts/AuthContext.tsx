"use client"

import * as React from "react"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { useSignMessage, useDisconnect } from "wagmi"
import { SiweMessage } from "siwe"
import * as api from "@/services/api"

interface AuthState {
  isAuthenticated: boolean
  walletAddress: string | null
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (address: string, chainId: number) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()

  const { data, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: api.fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const isAuthenticated = data !== null && data !== undefined
  const walletAddress = data?.walletAddress ?? null

  const signIn = React.useCallback(
    async (address: string, chainId: number) => {
      const { nonce } = await api.fetchNonce()

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to Handshake",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      }).prepareMessage()

      const signature = await signMessageAsync({ message })
      await api.verifySignature(message, signature)
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
    [signMessageAsync, queryClient]
  )

  const signOut = React.useCallback(async () => {
    try {
      await api.logout()
    } catch {
      // session may already be expired
    }
    disconnect()
    queryClient.setQueryData(["auth", "me"], null)
    await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
  }, [queryClient, disconnect])

  const value = React.useMemo<AuthContextValue>(
    () => ({ isAuthenticated, walletAddress, isLoading, signIn, signOut }),
    [isAuthenticated, walletAddress, isLoading, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
