import type { App } from "@/server"
import { hc } from "hono/client"

export const hono = hc<App>("/")
