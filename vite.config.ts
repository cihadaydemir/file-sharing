import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import { cloudflare } from "@cloudflare/vite-plugin"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    cloudflare(),
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/client/routes",
      generatedRouteTree: "./src/client/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
  ],
  server:{
    port: 3000,
    strictPort: true,
  }
})
