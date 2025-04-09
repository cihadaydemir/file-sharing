import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { hono } from "../lib/hono-client"

export const getApiQueryConfig = {
  queryKey: ["api"],
  queryFn: async () => {
    const response = await hono.api.$get()
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data = await response.json()
    return data
  },
} satisfies UseQueryOptions

export const useApi = () => useQuery(getApiQueryConfig)
