import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import db from "../db";
import ENV from "./env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg", // or "mysql", "sqlite"
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			enabled: true,
			clientId: ENV.GOOGLE_CLIENT_ID,
			clientSecret: ENV.GOOGLE_CLIENT_SECRET,
		},
		github: {
			enabled: true,
			clientId: ENV.GITHUB_CLIENT_ID,
			clientSecret: ENV.GITHUB_CLIENT_SECRET,
		},
	},
	trustedOrigins: [ENV.CLIENT_URL],
	plugins: [admin(), openAPI()],
	baseURL: ENV.BETTER_AUTH_URL,
	user: {
		additionalFields: {
			deletedAt: {
				type: "date",
				required: false,
			},
		},
		deleteUser: { enabled: false },
		changeEmail: { enabled: true },
	},
});
