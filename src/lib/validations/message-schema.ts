import z from "zod";

export const createMessageSchema = z.object({
	userId: z.string().min(1),
});

export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;
