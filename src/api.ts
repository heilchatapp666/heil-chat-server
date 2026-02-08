import { Hono } from "hono";
import db from "./db";
import tables from "./db/tables";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import messageRouter from "./routes/message";
import userRouter from "./routes/user";
import type { AuthType } from "./types/auth";

const api = new Hono<{ Variables: AuthType }>();

api.get("/", (c) => {
	return c.json(
		{ error: false, message: "OK", data: new Date(Date.now()) },
		200,
	);
});

api.get("/db", async (c) => {
	const userCount = await db.$count(tables.user);
	return c.json(
		{ error: false, message: "OK", data: { count: userCount } },
		200,
	);
});

api.route("/auth", authRouter);

api.route("/users", userRouter);
api.route("/chats", chatRouter);
api.route("/messages", messageRouter);

export default api;
