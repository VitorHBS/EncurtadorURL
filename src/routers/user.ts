import Router from "express";
import { Auth } from "../middlewares/authMiddleware";



const userRouter = Router();

//userRouter.get("/link", findLink)
//userRouter.post("/link", Auth.private, createLink)
//userRouter.patch("/link/:id", Auth.private, updateLink)
//userRouter.delete("/link/:id", Auth.private, deletelink)

export default userRouter;