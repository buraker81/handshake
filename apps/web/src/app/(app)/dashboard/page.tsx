"use client"

import { AuthGate } from "@/components/AuthGate"
import { useAuth } from "@/contexts/AuthContext"
import { useModels } from "@/hooks/useModels"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import type { IModel } from "@handshake/types"

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function DashboardContent() {
  const { walletAddress } = useAuth()
  const { data, isLoading } = useModels({ owner: walletAddress ?? undefined })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        {walletAddress && (
          <p className="text-sm text-muted-foreground font-mono mt-1">
            {truncateAddress(walletAddress)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">
              My Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-12" /> : (data?.total ?? 0)}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">
              On-chain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                data?.models.filter((m: IModel) => m.onChainRegistered).length ?? 0
              )}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">
              Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm font-medium text-tx-confirmed">Avalanche Fuji</span>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          My Models
        </h2>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : data && data.models.length > 0 ? (
          <div className="flex flex-col gap-2">
            {data.models.map((model: IModel) => (
              <Link key={model._id} href={`/registry/${model._id}`}>
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 px-4 py-3 hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{model.name}</span>
                    <Badge variant="secondary" className="text-xs">{model.task}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {model.onChainRegistered && (
                      <span className="text-xs text-tx-confirmed">● Verified</span>
                    )}
                    <span className="text-xs text-muted-foreground">v{model.version}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-sm">No models yet.</p>
            <Link href="/upload" className="text-xs text-primary hover:underline mt-1">
              Upload your first model →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardContent />
    </AuthGate>
  )
}
