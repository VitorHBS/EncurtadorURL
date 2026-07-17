import Router from "express";
import * as authController from "../controllers/authController"
import { loginLimiter } from "../libs/rate-limit";


const authRouter = Router();

authRouter.post("/auth/register", authController.signup);
authRouter.post("/auth/login", loginLimiter , authController.signin);

export default authRouter;