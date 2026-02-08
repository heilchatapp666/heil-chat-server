import type { Context } from "hono";
import { auth } from "../lib/auth";

export const authController = async (c: Context) => {
	return auth.handler(c.req.raw);
};
