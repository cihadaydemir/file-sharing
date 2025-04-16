import { hono } from "../lib/hono-client"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const useFileUpload = () =>
  useMutation({
    mutationFn: async (files: File[]) => {
      // Check file sizes before uploading
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File "${file.name}" is too large. Maximum size is 10MB.`)
          // Prevent the upload by throwing an error
          throw new Error("File size limit exceeded")
        }
      }

      // Proceed with upload if all files are within the size limit
      const res = await hono.api.upload.$put({ form: { files: files } })
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return await res.json()
    },
    onError: (err) => {
      // Avoid double-toasting for size errors
      if (err.message !== "File size limit exceeded") {
        toast.error(`Failed to upload file: ${err.message}`)
      }
    },
  })
