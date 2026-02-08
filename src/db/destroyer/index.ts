import db from "..";
import chatDestroyer from "./chat";
import userDestroyer from "./user";

async function main() {
	await userDestroyer();
	await chatDestroyer();
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
