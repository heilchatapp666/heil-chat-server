import z from "zod";

export const stringParamIdSchema = z.object({
	id: z.string("ID must be string!").min(1, "ID must be string!"),
});
