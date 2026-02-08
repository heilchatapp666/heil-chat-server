import { sql } from "drizzle-orm";
import {
	check,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { id, timeStamps } from "@/lib/schema-helper";
import { user } from "./auth-schema";

export const chat = pgTable("chats", {
	id: text().notNull().primaryKey(),
	...timeStamps,
});

export const chatParticipant = pgTable(
	"chat_participants",
	{
		id,
		chatId: text("chat_id")
			.notNull()
			.references(() => chat.id, { onDelete: "cascade" }),
		participantId: text("participant_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		...timeStamps,
	},
	(table) => [uniqueIndex().on(table.chatId, table.participantId)],
);

export const messageDeletionType = pgEnum("message_deletion_type", [
	"FOR_SENDER",
	"FOR_EVERYONE",
]);

export const message = pgTable("messages", {
	id,
	chatId: text("chat_id")
		.notNull()
		.references(() => chat.id, { onDelete: "cascade" }),
	senderId: text("sender_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	text: text(),
	...timeStamps,
});

export const messageMediaType = pgEnum("message_media_type", [
	"IMAGE",
	"VIDEO",
]);

export const messageMedia = pgTable("message_media", {
	id: serial().primaryKey(),
	messageId: uuid("message_id")
		.notNull()
		.references(() => message.id, { onDelete: "cascade" }),
	mediaType: messageMediaType("media_type").notNull(),
	mediaId: text("media_id").notNull(),
	mediaURL: text("media_url").notNull(),
});

export const blockUser = pgTable(
	"block_user",
	{
		id: serial().primaryKey(),
		blockerId: text("blocker_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		blockedId: text("blocked_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		...timeStamps,
	},
	(table) => [
		uniqueIndex().on(table.blockerId, table.blockedId),
		check("no_self_block", sql`${table.blockerId} <> ${table.blockedId}`),
	],
);

export const messageDeletion = pgTable(
	"message_deletions",
	{
		id: serial().primaryKey(),
		messageId: uuid("message_id")
			.notNull()
			.references(() => message.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		deletionType: messageDeletionType("message_deletion_type"),
		deletedAt: timestamp("deleted_at").$defaultFn(() => new Date(Date.now())),
	},
	(table) => [uniqueIndex().on(table.messageId, table.userId)],
);
