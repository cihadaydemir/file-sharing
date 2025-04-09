import { FileDrop } from "../components/file-drop"
import { createFileRoute } from "@tanstack/react-router"
import { useApi } from "../hooks/useApi"
export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { data } = useApi()

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <p>RPC Data:{data?.message}</p>
      <FileDrop />
    </div>
  )
}
