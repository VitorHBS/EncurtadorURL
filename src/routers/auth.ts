import Router from "express";
import * as authController from "../controllers/authController"


const authRouter = Router();

authRouter.post("/auth/register", authController.signup);
authRouter.post("/auth/login", authController.signin);

export default authRouter;