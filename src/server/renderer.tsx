import { reactRenderer } from "@hono/react-renderer"
import { Script, Link } from "hono-vite-react-stack/components"

export const renderer = reactRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>File Sharing</title>
        <Script src="src/client/main.tsx" />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
})
