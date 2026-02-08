import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import ENV from "./src/lib/env";

export default defineConfig({
	out: "./src/db/migrations",
	schema: "./src/db/schema/*.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: ENV.DATABASE_URL,
	},
	verbose: true,
	strict: true,
});
