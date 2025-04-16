import type { FileMetadata } from "@/server"
import { hono } from "../lib/hono-client"
import { useQuery } from "@tanstack/react-query"

interface FilesResponse {
  files: FileMetadata[]
}

export const useFiles = () => {
  return useQuery<FilesResponse>({
    queryKey: ["files"],
    queryFn: async () => {
      const res = await hono.api.files.$get()
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return await res.json()
    },
  })
}
