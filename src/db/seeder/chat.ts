import { notInArray } from "drizzle-orm";
import db from "..";
import tables from "../tables";

export default async function chatSeeder() {
	console.log("Loading...");

	let userCount = 0;
	const userIds = [] as Array<string>;
	const PARTICIPANTS_COUNT = 2;
	const countingResult = await db.$count(tables.user);
	if (countingResult % PARTICIPANTS_COUNT === 1) {
		userCount = countingResult - 1;
	} else {
		userCount = countingResult;
	}
	if (userCount < PARTICIPANTS_COUNT) {
		throw new Error("Not Enough user data!");
	}
	console.log("Starting chat seeder...");
	while (userIds.length < userCount) {
		console.log("Obtaining user count...");
		console.log(userCount, " of User number obtained...");
		console.log("Creating chat participant data...");
		const user = await db.query.user.findMany({
			where:
				userIds.length < 2 ? undefined : notInArray(tables.user.id, userIds),
			limit: PARTICIPANTS_COUNT,
			columns: { id: true },
		});
		console.log("User data created...");
		const [chat] = await db
			.insert(tables.chat)
			.values({ id: crypto.randomUUID() })
			.returning();
		console.log("Inserting chat and chat participant data into database...");
		await db.insert(tables.chatParticipant).values([
			{
				chatId: chat.id,
				participantId: user[0].id,
			},
			{
				chatId: chat.id,
				participantId: user[1].id,
			},
		]);
		console.log("All chat and chat participant inserted successfully...");
		for (const data of user) {
			userIds.push(data.id);
		}
		console.log("User data inserted into database...");
		console.log("Couple of chat data:", userIds.length / 2);
		const chatCount = await db.$count(tables.chat);
		console.log(`chat Count: ${chatCount}`);
		const chatParticipantCount = await db.$count(tables.chatParticipant);
		console.log(`chat Participant Count: ${chatParticipantCount}`);
	}
	console.log("Seeding chat data completed!");
}
