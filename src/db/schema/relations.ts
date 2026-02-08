import { relations } from "drizzle-orm";
import {
	chat,
	chatParticipant,
	message,
	messageDeletion,
	messageMedia,
} from ".";
import { user } from "./auth-schema";

export const userRelations = relations(user, ({ many }) => ({
	chats: many(chat),
	messageParticipants: many(chatParticipant),
	deletedChat: many(messageDeletion),
	messages: many(message),
}));

export const chatRelations = relations(chat, ({ many }) => ({
	participants: many(chatParticipant),
	messages: many(message),
}));

export const chatParticipantRelations = relations(
	chatParticipant,
	({ one }) => ({
		message: one(chat, {
			fields: [chatParticipant.chatId],
			references: [chat.id],
		}),
		user: one(user, {
			fields: [chatParticipant.participantId],
			references: [user.id],
		}),
	}),
);

export const messageRelations = relations(message, ({ one, many }) => ({
	media: many(messageMedia),
	chat: one(chat, {
		fields: [message.chatId],
		references: [chat.id],
	}),
	sender: one(user, {
		fields: [message.senderId],
		references: [user.id],
	}),
	deletedChat: many(messageDeletion),
}));

export const messageMediaRelations = relations(messageMedia, ({ one }) => ({
	message: one(message, {
		fields: [messageMedia.messageId],
		references: [message.id],
	}),
}));

export const messageDeletionRelations = relations(
	messageDeletion,
	({ one }) => ({
		user: one(user, {
			fields: [messageDeletion.userId],
			references: [user.id],
		}),
		message: one(message, {
			fields: [messageDeletion.messageId],
			references: [message.id],
		}),
	}),
);
