import type { Context } from "hono";

export const ExpectedError = (c: Context, message: string) => {
	return c.json({ error: true, message });
};
