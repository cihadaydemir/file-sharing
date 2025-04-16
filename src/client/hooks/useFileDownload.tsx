import { hono } from "../lib/hono-client"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

export const useFileDownload = () => {
  return useMutation({
    mutationFn: async (key: string) => {
      const res = await hono.api.download.$get({ query: { key } })
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      // Create an anchor element and trigger download
      const a = document.createElement("a")
      a.href = url
      a.download = key // Use the file key as the download filename
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return { success: true }
    },
    onError: (err) => {
      toast.error(`Failed to download file: ${err.message}`)
    },
  })
}
