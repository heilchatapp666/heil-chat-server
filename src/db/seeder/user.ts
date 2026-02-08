import { faker } from "@faker-js/faker";
import { auth } from "@/lib/auth";
import db from "..";
import tables from "../tables";

export default async function userSeeder() {
	console.log("Loading...");

	console.log("Starting user seeder...");
	console.log("Obtaining user count...");
	const count = 30;
	console.log(count, " of User number obtained...");
	console.log("Creating user data...");
	const userArray = Array.from({ length: count }).map(() => {
		const userName = faker.person.firstName().toLowerCase();
		return {
			name: userName,
			email: `${userName}@example.com`,
			password: "password",
		};
	});
	console.log("User Data created...");
	console.log("Inserting user data into database...");
	for (const user of userArray) {
		await auth.api.signUpEmail({
			body: user,
		});
	}
	console.log("All user inserted successfully...");
	console.log("Deleting all session...");
	await db.delete(tables.session);
	console.log("All user session deleted successfully...");
	console.log("Seeding user data completed!");
}
