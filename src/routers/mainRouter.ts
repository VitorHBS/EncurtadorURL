import express from "express"
import { ping } from "../controllers/ping";

const mainRouter = express.Router()

mainRouter.get("/ping", ping)


export default mainRouter