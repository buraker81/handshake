import { useQuery, keepPreviousData } from "@tanstack/react-query"
import * as api from "@/services/api"
import type { QueryModelParams } from "@/services/api"

export function useModels(params: QueryModelParams = {}) {
  return useQuery({
    queryKey: ["models", params],
    queryFn: () => api.fetchModels(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

export function useModel(id: string) {
  return useQuery({
    queryKey: ["models", id],
    queryFn: () => api.fetchModel(id),
    staleTime: 60_000,
    enabled: !!id,
  })
}
