import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react" // Import useState

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const useFileUpload = () => {
  // State to track upload progress
  const [progress, setProgress] = useState(0)

  const mutation = useMutation({
    // mutationFn now receives an object with files and the progress callback
    mutationFn: async (files: File[]) => {
      // Reset progress at the start of a new mutation
      setProgress(0)

      // Check file sizes before uploading
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File "${file.name}" is too large. Maximum size is 10MB.`)
          throw new Error("File size limit exceeded")
        }
      }

      // Use XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()
        for (const file of files) {
          // Use 'files' as the key, matching your backend validator
          formData.append("files", file, file.name)
        }

        // Attach progress listener
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded * 100) / event.total)
            setProgress(percentage) // Update progress state
          }
        }

        // Handle completion
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              // Try to parse the response as JSON
              const jsonResponse = JSON.parse(xhr.responseText)
              resolve(jsonResponse) // Resolve with the parsed JSON
            } catch (e) {
              // If parsing fails, maybe it's just text or empty
              resolve(xhr.responseText) // Resolve with raw text
            }
          } else {
            // Handle HTTP errors
            reject(new Error(`Upload failed: ${xhr.statusText || xhr.status}`))
          }
          setProgress(100) // Ensure progress reaches 100 on completion
        }

        // Handle network errors
        xhr.onerror = () => {
          reject(new Error("Upload failed due to network error."))
          setProgress(0) // Reset progress on error
        }

        // Configure and send the request
        // Use the correct API endpoint URL. You might get this from your hono client setup
        // or define it explicitly. Assuming '/api/upload' based on your backend.
        const uploadUrl = "/api/upload" // Adjust if your base URL is different
        xhr.open("PUT", uploadUrl, true)
        // Note: Don't set Content-Type header manually for FormData,
        // the browser does it correctly with the boundary.
        xhr.send(formData)
      })
    },
    onError: (err: Error) => {
      // Explicitly type err as Error
      // Avoid double-toasting for size errors
      if (err.message !== "File size limit exceeded") {
        toast.error(`Failed to upload file: ${err.message}`)
      }
      setProgress(0) // Reset progress on error
    },
    onSuccess: () => {
      // Optionally reset progress on success if needed,
      // though it might jump back to 0 quickly.
      setProgress(0)
    },
  })

  // Return the mutation object and the progress state
  return { ...mutation, progress }
}
