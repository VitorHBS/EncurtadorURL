import Router from "express";
import { Auth } from "../middlewares/authMiddleware";
import * as userController from "../controllers/user"
import * as clickController from "../controllers/click"


const userRouter = Router();

userRouter.get("/link", Auth.private, userController.findUrlsByUser)
userRouter.get("/link/:id", Auth.private, userController.findLinkByLinkId)
userRouter.post("/link", Auth.private, userController.createURL)
userRouter.patch("/link/:id", Auth.private, userController.updateURL)
userRouter.delete("/link/:id", Auth.private, userController.deleteURL)

userRouter.get("/link/:slug", clickController.countClick);

export default userRouter;