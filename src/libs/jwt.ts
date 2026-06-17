import JWT from "jsonwebtoken";



export const generateToken = (userId: number): string => {

    const secret = process.env.JWT_SECRET_KEY;
    const expiresIn = process.env.JWT_EXPIRE;

    if (!expiresIn || !secret) throw new Error("variáveis JWT não definidas");

    const token = JWT.sign(
        { id: userId },
        secret as string,
        { expiresIn: "2h" }
    );

    return token;
}