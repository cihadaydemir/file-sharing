import { Hono } from "hono"

const app = new Hono<{ Bindings: Env }>()

const routes = app.get("/api", (c) => {
  return c.json({ message: "Hello from API" })
})

export default app

export type App = typeof routes
