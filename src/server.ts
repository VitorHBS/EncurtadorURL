import helmet from "helmet";
import cors from "cors";
import express from "express";
import dotenv from "dotenv"
import authRouter from "./routers/auth";
import { errorHandler } from "./middlewares/errorHandler"
import userRouter from "./routers/user";
import { limit } from "./libs/rate-limit";
dotenv.config()

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(limit)
server.use(authRouter);
server.use(userRouter)
server.use(errorHandler)

server.listen(3000, () => {
    console.log(`Server rodando na porta http://localhost:3000/`);
})