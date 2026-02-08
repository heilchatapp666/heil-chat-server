import z from "zod";
import "dotenv/config";

const envSchema = z.object({
	DATABASE_URL: z
		.string("Please setup DATABASE_URL in .env")
		.min(1, "Please setup DATABASE_URL in .env"),
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	BETTER_AUTH_SECRET: z.string().min(1),
	BETTER_AUTH_URL: z.url(),
	CLIENT_URL: z.url(),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	GITHUB_CLIENT_ID: z.string().min(1),
	GITHUB_CLIENT_SECRET: z.string().min(1),
});

const getEnv = () => {
	const { success, error, data } = envSchema.safeParse(process.env);
	if (!success) {
		throw new Error(
			`ENV Error: ${error.issues[0].path}: ${error.issues[0].message}`,
		);
	}
	return data;
};

const ENV = getEnv();

export default ENV;
