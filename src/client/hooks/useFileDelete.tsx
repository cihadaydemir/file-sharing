import { useMutation, useQueryClient } from "@tanstack/react-query"

import { hono } from "../lib/hono-client"
import { toast } from "sonner"

export const useFileDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (key: string) => {
      const res = await hono.api.delete.$delete({ query: { key } })
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return await res.json()
    },
    onSuccess: () => {
      toast.success("File deleted successfully")
      // Invalidate the files query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["files"] })
    },
    onError: (err) => {
      toast.error(`Failed to delete file: ${err.message}`)
    },
  })
}
