import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import db from "@/db";
import tables from "@/db/tables";
import { ExpectedError } from "@/lib/errors/expected-error";
import { NotAuthenticatedError } from "@/lib/errors/not-authenticated";
import { stringParamIdSchema } from "@/lib/validations";
import { createTextOnlyMessageSchema } from "@/lib/validations/message-schema";
import { authMiddleware } from "@/middleware/auth";
import chatRepository from "@/repositories/chat";
import type { AuthType } from "@/types/auth";

const messageRouter = new Hono<{ Variables: AuthType }>();
const r = messageRouter;

r.use(authMiddleware);

r.post(
	"/text-only/:id",
	zValidator("param", stringParamIdSchema),
	zValidator("json", createTextOnlyMessageSchema),
	async (c) => {
		const { id: chatId } = c.req.valid("param");
		const formData = c.req.valid("json");
		const currentUser = c.get("user");

		if (!currentUser) {
			return NotAuthenticatedError(c);
		}

		const isCountedAsChatParticipant =
			await chatRepository.countingAsParticipant({
				chatId,
				currentUserId: currentUser.id,
			});

		if (!isCountedAsChatParticipant) {
			return ExpectedError(c, "You are not this chat participant");
		}

		const [message] = await db
			.insert(tables.message)
			.values({
				chatId,
				senderId: currentUser.id,
				text: formData.text,
			})
			.returning();

		if (!message) {
			return ExpectedError(c, "Failed create text only message!");
		}

		return c.json({
			error: false,
			message: "Success to create text only message!",
			data: message,
		});
	},
);

export default messageRouter;
