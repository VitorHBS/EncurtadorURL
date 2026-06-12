import helmet from "helmet";
import cors from "cors";
import express from "express";
import dotenv from "dotenv"
dotenv.config()

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.listen(3000, () => {
    console.log(`Server rodando na porta http://localhost:3000/`);
})