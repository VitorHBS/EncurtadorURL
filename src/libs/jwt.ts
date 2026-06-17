import JWT from "jsonwebtoken";



export const generateToken = (userId: number): string => {

    if (!process.env.JWT_SECRET_KEY) throw new Error("variáveis JWT não definidas");

    const token = JWT.sign(
        { id: userId },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "2h" }
    );

    return token;
}