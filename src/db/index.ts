import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import ENV from "@/lib/env";
import tables from "./tables";

const pool = new Pool({ connectionString: ENV.DATABASE_URL });

const db =
	ENV.NODE_ENV === "production"
		? drizzleNeon(ENV.DATABASE_URL, { schema: { ...tables } })
		: drizzle({ client: pool, schema: { ...tables } });

export default db;
