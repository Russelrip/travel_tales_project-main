import { Router } from "express";
import { refreshAccessToken } from "../controllers/registered-user-controller";

const authRouter = Router();

authRouter.post("/refresh-token", refreshAccessToken);

export default authRouter;