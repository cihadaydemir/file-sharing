import { Hono } from "hono";
import { renderer } from "./renderer";

const app = new Hono();

app.get("/api", (c) => {
	return c.json({ message: "Hello from API" });
});

app.use(renderer);

app.get("/", (c) => {
	return c.render(<div id="root" />);
});

export default app;
