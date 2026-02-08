import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import api from "./api";
import ENV from "./lib/env";

const app = new Hono();

app.use(logger());

app.use(
	cors({
		origin: [ENV.CLIENT_URL],
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.get("/", (c) => {
	return c.json({ error: false });
});

app.route("/api", api);

app.notFound((c) => {
	return c.json({ error: true, message: "Not found URL" }, 404);
});

app.onError(({ message }) => {
	console.log("Error: ", message);

	return Response.json(
		{
			error: true,
			message: ENV.NODE_ENV === "production" ? "Something went wrong" : message,
		},
		{ status: 500 },
	);
});

export default app;
