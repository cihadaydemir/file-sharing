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
        <p className="font-bold">FileShare</p>
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        {import.meta.env.DEV && (
          <Link to="/admin" className="[&.active]:font-bold">
            Admin
          </Link>
        )}
      </div>
      <hr />
      <div className="flex h-full w-full flex-col overflow-hidden p-4">
        <Outlet />
      </div>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </Providers>
  ),
})
