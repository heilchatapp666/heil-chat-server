import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid().defaultRandom().primaryKey();

export const timeStamps = {
	createdAt: timestamp("created_at", { mode: "date" }).$defaultFn(
		() => new Date(Date.now()),
	),
	updatedAt: timestamp("updated_at", { mode: "date" })
		.$defaultFn(() => new Date(Date.now()))
		.$onUpdateFn(() => new Date(Date.now())),
};
