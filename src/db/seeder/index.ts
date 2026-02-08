import db from "..";
import chatSeeder from "./chat";
import userSeeder from "./user";

async function main() {
	await userSeeder();
	await chatSeeder();
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.then(async () => {
		if ("end" in db.$client && typeof db.$client.end === "function") {
			await db.$client.end();
		}
	});
