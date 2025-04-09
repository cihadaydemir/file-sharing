import { useEffect, useState } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { hono } from "../lib/hono-client"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const [data, setData] = useState("")
  useEffect(() => {
    const fetchData = async () => {
      const response = await hono.api.$get()
      if (!response.ok) {
        console.error(response.status)
      }

      const data = await response.json()
      setData(data.message)
    }

    fetchData()
  }, [])

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <p>RPC Data:{data}</p>
    </div>
  )
}
