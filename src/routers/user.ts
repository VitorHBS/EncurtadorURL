import Router from "express";
import { Auth } from "../middlewares/authMiddleware";
import * as userController from "../controllers/user"


const userRouter = Router();

userRouter.get("/link", userController.findLinksByUser)
userRouter.post("/link", Auth.private, userController.createURL)
//userRouter.patch("/link/:id", Auth.private, updateLink)
//userRouter.delete("/link/:id", Auth.private, deletelink)

export default userRouter;