import Router from "express";
import * as authController from "../controllers/authController"


const authRouter = Router();

authRouter.post("/auth/register", authController.signup);

export default authRouter;