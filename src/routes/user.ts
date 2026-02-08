import { Hono } from "hono";
import { authMiddleware } from "@/middleware/auth";
import { getAllUsers } from "../controllers/user";

const userRouter = new Hono();

const r = userRouter;

r.use(authMiddleware);

r.get("/", getAllUsers);

export default userRouter;
