import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"

import { Providers } from "../components/providers"
import type { QueryClient } from "@tanstack/react-query"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Providers>
      <div className="flex gap-2 p-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </Providers>
  ),
})
