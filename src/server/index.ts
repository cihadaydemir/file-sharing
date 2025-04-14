import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"

const app = new Hono<{ Bindings: Env }>()

const routes = app
  .get("/api", (c) => {
    return c.json({ message: "Hello from API" })
  })
  .get("/api/files", async (c) => {
    const fileKeys = await c.env.file_sharing_r2.list()
    const files = []
    for (const objects of fileKeys.objects) {
      const r2Obj = await c.env.file_sharing_r2.get(objects.key)
      if (r2Obj) {
        const blob = await r2Obj.blob()

        files.push({
          key: objects.key,
          size: blob.size,
          type: blob.type,
          lastModified: objects.uploaded,
        })
      }
    }

    return c.json({ success: true, files })
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
