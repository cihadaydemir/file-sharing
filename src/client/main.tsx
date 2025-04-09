import "./style.css"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"

import ReactDOM from "react-dom/client"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { StrictMode } from "react"
import { routeTree } from "./routeTree.gen"

const queryClient = new QueryClient()
// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
  },
  defaultPreload: "intent",
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

// Render the app
const rootElement = document.getElementById("root")!

if (!rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
