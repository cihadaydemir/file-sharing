import { hono } from "../lib/hono-client"
import { useQuery } from "@tanstack/react-query"

interface FileMetadata {
  key: string
  size: number
  type: string
  lastModified: string
}

interface FilesResponse {
  success: boolean
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
