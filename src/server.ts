import helmet from "helmet";
import cors from "cors";
import express from "express";
import dotenv from "dotenv"
import mainRouter from "./routers/mainRouter";
import authRouter from "./routers/auth";
dotenv.config()

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(mainRouter);
server.use(authRouter);

server.listen(3000, () => {
    console.log(`Server rodando na porta http://localhost:3000/`);
})