import { FilesTable } from "@/client/components/files-table"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">
      <h1 className="font-bold text-2xl">Files</h1>
      <FilesTable />
    </div>
  )
}
