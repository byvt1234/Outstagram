export class ApiError extends Error {
    constructor(statusCode, message, errorData={}) {
        super(message);
        this.statusCode = statusCode
        this.errorData = errorData
    }
}