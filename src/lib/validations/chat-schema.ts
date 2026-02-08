import z from "zod";

export const createChatSchema = z.object({
	userId: z.string().min(1),
});

export type CreateChatSchemaType = z.infer<typeof createChatSchema>;
