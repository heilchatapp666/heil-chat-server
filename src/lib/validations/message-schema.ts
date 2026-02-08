import z from "zod";

export const createTextOnlyMessageSchema = z.object({
	text: z.string(),
});

export type CreateTextOnlyMessageSchemaType = z.infer<
	typeof createTextOnlyMessageSchema
>;
