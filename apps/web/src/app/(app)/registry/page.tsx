"use client"

import { useState } from "react"
import Link from "next/link"
import { useModels } from "@/hooks/useModels"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Task, Framework, BadgeLevel } from "@handshake/types"
import type { IModel } from "@handshake/types"
import { ShieldCheckIcon } from "lucide-react"

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function badgeLevelColor(level: BadgeLevel) {
  const map: Record<BadgeLevel, string> = {
    [BadgeLevel.Bronze]: "text-badge-bronze border-badge-bronze/30 bg-badge-bronze/10",
    [BadgeLevel.Silver]: "text-badge-silver border-badge-silver/30 bg-badge-silver/10",
    [BadgeLevel.Gold]: "text-badge-gold border-badge-gold/30 bg-badge-gold/10",
    [BadgeLevel.Platinum]: "text-badge-platinum border-badge-platinum/30 bg-badge-platinum/10",
  }
  return map[level] ?? ""
}

function ModelCard({ model }: { model: IModel }) {
  return (
    <Link href={`/registry/${model._id}`}>
      <Card className="h-full hover:border-white/25 hover:bg-card/80 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm leading-snug line-clamp-1">{model.name}</CardTitle>
            {model.onChainRegistered && (
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium shrink-0 ${badgeLevelColor(BadgeLevel.Bronze)}`}>
                <ShieldCheckIcon className="size-3" />
                Verified
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Badge variant="secondary" className="text-xs">{model.task}</Badge>
            <Badge variant="outline" className="text-xs">{model.framework}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-xs line-clamp-2 mb-3">
            {model.description ?? "No description provided."}
          </CardDescription>
          <p className="text-xs text-muted-foreground font-mono">
            {truncateAddress(model.ownerAddress)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

function ModelCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-1.5 mt-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-2/3 mb-3" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  )
}

export default function RegistryPage() {
  const [task, setTask] = useState<string>("")
  const [framework, setFramework] = useState<string>("")

  const { data, isLoading, isError } = useModels({
    task: task || undefined,
    framework: framework || undefined,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Model Registry</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {data ? `${data.total} models registered` : "Discover AI models on Handshake"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={task || "all"} onValueChange={(v) => setTask(v === "all" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tasks</SelectItem>
            {Object.values(Task).map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={framework || "all"} onValueChange={(v) => setFramework(v === "all" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All frameworks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All frameworks</SelectItem>
            {Object.values(Framework).map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load models. Make sure the API is running.
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ModelCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.models.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.models.map((model) => (
            <ModelCard key={model._id} model={model} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-sm">No models found.</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Try adjusting filters or upload the first one.</p>
        </div>
      )}
    </div>
  )
}
