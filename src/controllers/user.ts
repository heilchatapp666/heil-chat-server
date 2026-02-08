import type { Context } from "hono";
import db from "../db";

export const getAllUsers = async (c: Context) => {
	const query = c.req.query("q")?.trim(); // q can be user's name, user's email, or user's id
	if (!query) {
		return c.json(
			{ error: false, message: "Success to get all users", data: [] },
			200,
		);
	}
	const users = await db.query.user.findMany({
		where: (table, { or, eq, ilike }) => {
			return or(
				ilike(table.name, `%${query}`),
				ilike(table.email, `%${query}`),
				eq(table.id, query),
			);
		},
		limit: 10,
		columns: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	});
	return c.json(
		{ error: false, message: "Success to get all users", data: users },
		200,
	);
};
