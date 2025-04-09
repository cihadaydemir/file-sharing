import { hono } from "../lib/hono-client"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

export const useFileUpload = () =>
  useMutation({
    mutationFn: async (files: File[]) => {
      console.log("uploading files", files)
      const res = await hono.api.upload.$put({ form: { files: files } })
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return await res.json()
    },
    onError: (err) => {
      toast.error(`Failed to upload file: ${err.message}`)
    },
  })
