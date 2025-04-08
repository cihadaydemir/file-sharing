import "./style.css"

import { RouterProvider, createRouter } from "@tanstack/react-router"

import ReactDOM from "react-dom/client"
import { StrictMode } from "react"
import { routeTree } from "./routeTree.gen"

// Import the generated route tree

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
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
