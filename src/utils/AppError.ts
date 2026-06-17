export class AppError extends Error {
    statusCode: number
    status: "fail" | "error"
    isOperational: boolean

    constructor(message: string, statusCode = 500) {
        super(message);

        this.statusCode = statusCode
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;

        Object.setPrototypeOf(this, AppError.prototype)
        Error.captureStackTrace(this, this.constructor)
    }
}