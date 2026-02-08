import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import db from "@/db";
import tables from "@/db/tables";
import { ExpectedError } from "@/lib/errors/expected-error";
import { NotAuthenticatedError } from "@/lib/errors/not-authenticated";
import { stringParamIdSchema } from "@/lib/validations";
import { createChatSchema } from "@/lib/validations/chat-schema";
import { authMiddleware } from "@/middleware/auth";
import chatRepository from "@/repositories/chat";
import type { AuthType } from "@/types/auth";

const chatRouter = new Hono<{ Variables: AuthType }>();
const r = chatRouter;

r.use(authMiddleware);

r.get("/", async (c) => {
	const currentUser = c.get("user");
	if (!currentUser) {
		return NotAuthenticatedError(c);
	}
	const data = await db.query.chat.findMany({
		where: (chatTable, { exists, eq, and }) =>
			exists(
				db
					.select({ id: tables.chatParticipant.id })
					.from(tables.chatParticipant)
					.where(
						and(
							eq(tables.chatParticipant.chatId, chatTable.id),
							eq(tables.chatParticipant.participantId, currentUser.id),
						),
					),
			),
		with: {
			participants: {
				with: { user: { columns: { id: true, name: true, image: true } } },
			},
			messages: {
				limit: 1,
				orderBy(fields, { desc }) {
					return desc(fields.createdAt);
				},
			},
		},
	});

	return c.json({
		error: false,
		message: "Success to get all chats",
		data,
	});
});

r.get("/:id", zValidator("param", stringParamIdSchema), async (c) => {
	const { id } = c.req.valid("param");
	const currentUser = c.get("user");
	if (!currentUser) {
		return NotAuthenticatedError(c);
	}
	const isCountedAsChatParticipant = await chatRepository.countingAsParticipant(
		{
			chatId: id,
			currentUserId: currentUser.id,
		},
	);

	if (!isCountedAsChatParticipant) {
		return ExpectedError(c, "You are not this chat participant");
	}

	const data = await db.query.chat.findFirst({
		where: (chatTable, { eq }) => eq(chatTable.id, id),
		with: {
			participants: {
				with: { user: true },
			},
			messages: {
				with: {
					media: true,
					sender: { columns: { id: true, name: true, image: true } },
					deletedChat: { with: { user: true } },
				},
			},
		},
	});
	if (!data) {
		return ExpectedError(c, `Cannot found chat with ID ${id}`);
	}
	return c.json({
		error: false,
		message: `Success getting all data Chat data with ID ${id}`,
		data,
	});
});

r.post("/find-or-create", zValidator("json", createChatSchema), async (c) => {
	const { userId } = c.req.valid("json");
	const currentUser = c.get("user");
	if (!currentUser) {
		return NotAuthenticatedError(c);
	}

	let chatId: string;
	let resMessage: string;

	const existingMessage = await db.query.chat.findFirst({
		where: (chatTable, { and, exists, eq }) =>
			and(
				exists(
					db
						.select({ id: tables.chatParticipant.id })
						.from(tables.chatParticipant)
						.where(
							and(
								eq(tables.chatParticipant.chatId, chatTable.id),
								eq(tables.chatParticipant.participantId, userId),
							),
						),
				),
				exists(
					db
						.select({ id: tables.chatParticipant.id })
						.from(tables.chatParticipant)
						.where(
							and(
								eq(tables.chatParticipant.chatId, chatTable.id),
								eq(tables.chatParticipant.participantId, currentUser.id),
							),
						),
				),
			),
		columns: { id: true },
	});

	if (existingMessage) {
		chatId = existingMessage.id;
		resMessage = "Message data is already available";
	} else {
		const [newMessage] = await db
			.insert(tables.chat)
			.values({ id: crypto.randomUUID() })
			.returning();
		chatId = newMessage.id;
		await db.insert(tables.chatParticipant).values([
			{ chatId, participantId: userId },
			{ chatId, participantId: currentUser.id },
		]);
		resMessage = "New message data and it's participant is created";
	}

	const data = await db.query.chat.findFirst({
		where: (chatTable, { eq }) => eq(chatTable.id, chatId),
		with: { participants: true },
	});

	if (!data) {
		return ExpectedError(c, "failed to get or create chat data!");
	}

	return c.json({
		error: false,
		message: resMessage,
		data,
	});
});

export default chatRouter;
