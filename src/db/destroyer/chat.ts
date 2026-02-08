import db from "..";
import tables from "../tables";

export default async function chatDestroyer() {
	console.log("Loading...");

	console.log("Starting chat destroyer...");
	console.log("Obtaining chat count...");
	const count = await db.$count(tables.chat);
	console.log(count, " of chat number obtained...");

	console.log("Deleting chat data...");
	await db.delete(tables.chat);
	console.log("All chat data has been deleted successfully...");
	console.log("chat data destroyer completed!");
}
