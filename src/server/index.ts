import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"

export interface FileMetadata {
  key: string
  size: number
  type: string
}

const app = new Hono<{ Bindings: Env }>()

const routes = app
  .get("/api", (c) => {
    return c.json({ message: "Hello from API" })
  })
  .get("/api/files", async (c) => {
    const fileKeys = await c.env.file_sharing_r2.list()
    const files: FileMetadata[] = []
    for (const objects of fileKeys.objects) {
      const r2Obj = await c.env.file_sharing_r2.get(objects.key)

      if (r2Obj) {
        files.push({
          key: objects.key,
          size: objects.size,
          type: r2Obj.httpMetadata?.contentType || "application/octet-stream",
        })
      }
    }

    return c.json({ files })
  })
  .get("/api/download", async (c) => {
    const key = c.req.query("key")
    if (!key) {
      return c.json({ success: false, message: "File key is required" }, 400)
    }

    const file = await c.env.file_sharing_r2.get(key)
    if (!file) {
      return c.json({ success: false, message: "File not found" }, 404)
    }

    // Return the file as a blob with appropriate headers
    const headers = new Headers()
    headers.set("Content-Type", file.httpMetadata?.contentType || "application/octet-stream")
    headers.set("Content-Disposition", `attachment; filename="${key}"`)

    return new Response(file.body, {
      headers,
    })
  })
  .put(
    "/api/upload",
    zValidator(
      "form",
      z.object({
        files: z
          .union([z.instanceof(File), z.array(z.instanceof(File))])
          .transform((files) => (Array.isArray(files) ? files : [files])),
      }),
    ),
    async (c) => {
      const validated = c.req.valid("form")

      for (const file of validated.files) {
        const r2Object = await c.env.file_sharing_r2.put(file.name, file)
        if (!r2Object) {
          return c.json({ sucess: false, message: "Error uploading file" })
        }
      }
      return c.json({ sucess: true, message: "File uploaded successfully" })
    },
  )

export default app

export type App = typeof routes
