"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDownIcon, LogOutIcon, LayoutDashboardIcon } from "lucide-react"
import Link from "next/link"

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function WalletConnectButton() {
  const { isAuthenticated, signIn, signOut } = useAuth()

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openChainModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!ready) {
          return (
            <div aria-hidden style={{ opacity: 0, pointerEvents: "none", userSelect: "none" }}>
              <Button disabled size="sm">Connect Wallet</Button>
            </div>
          )
        }

        // State 1: Not connected
        if (!connected) {
          return (
            <Button size="sm" onClick={openConnectModal}>
              Connect Wallet
            </Button>
          )
        }

        // State 2: Wrong network
        if (chain.unsupported) {
          return (
            <Button
              size="sm"
              variant="destructive"
              onClick={openChainModal}
              className="border border-tx-pending text-tx-pending hover:bg-tx-pending/10"
            >
              Switch to Avalanche
            </Button>
          )
        }

        // State 3: Connected + right network, but not SIWE-signed in
        if (!isAuthenticated) {
          return (
            <Button
              size="sm"
              variant="outline"
              onClick={() => signIn(account.address, chain.id)}
            >
              <Avatar size="sm">
                <AvatarFallback className="text-xs">
                  {account.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-mono text-xs">{truncateAddress(account.address)}</span>
              <span className="text-muted-foreground text-xs">· Sign In</span>
            </Button>
          )
        }

        // State 4: Fully authenticated
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="gap-2">
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {account.address.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-mono text-xs">{truncateAddress(account.address)}</span>
                <ChevronDownIcon className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutDashboardIcon className="size-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={signOut}
              >
                <LogOutIcon className="size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }}
    </ConnectButton.Custom>
  )
}
