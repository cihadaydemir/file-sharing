import { FileDrop } from "../components/file-drop"
import { createFileRoute } from "@tanstack/react-router"
export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <div className="h-full min-h-full p-2">
      <FileDrop />
    </div>
  )
}
