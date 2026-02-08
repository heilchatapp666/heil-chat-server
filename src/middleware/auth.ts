import { createMiddleware } from "hono/factory";
import { auth } from "@/lib/auth";
import type { AuthType } from "@/types/auth";

export const authMiddleware = createMiddleware<{ Variables: AuthType }>(
	async (c, next) => {
		const res = await auth.api.getSession({ headers: c.req.raw.headers });
		if (!res || !res.session) {
			return c.json({ error: true, message: "Not Authenticated!" }, 401);
		}
		c.set("session", res.session);
		c.set("user", res.user);
		await next();
	},
);
