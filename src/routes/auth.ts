import { Hono } from "hono";
import { authController } from "../controllers/auth";

const authRouter = new Hono();

const r = authRouter;

r.on(["GET", "POST"], "/*", authController);

export default authRouter;
