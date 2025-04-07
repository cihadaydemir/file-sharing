import reactStack from "hono-vite-react-stack";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
	plugins: [
		TanStackRouterVite({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "./src/client/routes",
			generatedRouteTree: "./src/client/routeTree.gen.ts",
		}),
		reactStack({
			clientEntry: "./src/client/routes/main.tsx",
			serverEntry: "src/server/index.tsx",
			buildOutputDir: "dist-server",
			cssEntry: "src/style.css",
			serverDirectories: ["src/server/*"],
		}),
	],
});
