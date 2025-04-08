import { Hono } from "hono"

const app = new Hono<{ Bindings: Env }>()

// app.use("*", (c, next) => {
//   if (!c.req.url.startsWith("/api")) {
//     return c.env.ASSETS.fetch(c.req.url)
//   }
//   return next()
// })

app.get("/api", (c) => {
  return c.json({ message: "Hello from API" })
})

// app.use(renderer)

// app.get("/", (c) => {
//   console.log("/ triggered")
//   return c.render(<div id="root" />)
// })

export default app
