import Router from "express";
import { Auth } from "../middlewares/authMiddleware";
import * as userController from "../controllers/user"
import * as clickController from "../controllers/click"


const userRouter = Router();

userRouter.get("/link", Auth.private, userController.findUrlsByUser)
userRouter.get("/link/:id/analytics", Auth.private, clickController.analyticsCount)
userRouter.get("/link/:id", Auth.private, userController.findLinkByLinkId)
userRouter.get("/link/:slug", clickController.countClick);

userRouter.post("/link", Auth.private, userController.createURL)

userRouter.patch("/link/:id", Auth.private, userController.updateURL)
userRouter.patch("/user/me", Auth.private, userController.updateUser)

userRouter.delete("/link/:id", Auth.private, userController.deleteURL)



export default userRouter;