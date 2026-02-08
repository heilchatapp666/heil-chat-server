import db from "..";
import tables from "../tables";

export default async function userDestroyer() {
	console.log("Loading...");

	console.log("Starting user destroyer...");
	console.log("Obtaining user count...");
	const count = await db.$count(tables.user);
	console.log(count, " of User number obtained...");

	console.log("Deleting user data...");
	await db.delete(tables.user);
	console.log("All user data has been deleted successfully...");
	console.log("User data destroyer completed!");
}
