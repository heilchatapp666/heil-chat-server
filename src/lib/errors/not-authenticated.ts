import type { Context } from "hono";

export const NotAuthenticatedError = (c: Context) => {
	return c.json({ error: true, message: "Not Authenticated" });
};
