import dotenv from "dotenv"

dotenv.config()

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue
    if (value == null) {
        throw new Error(`키 ${key}는 undefined`)
    }
    return value
}

export const config = {
    jwt: {
        secretKey: required("JWT_SECRET"),
        expiresInSec: parseInt(required("JWT_EXPIRES_SEC"))
    },
    bcrypt: {
        saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 10))
    },
    host: {
        port: parseInt(required("HOST_PORT", 8080)),
        address: required("HOST_ADDRESS", "localhost"),
        multerUploadDir: required("MULTER_UPLOAD_DIR", "00_public/uploads/posts")
    },

    client: {
        port: parseInt(required("CLIENT_PORT", 5173)),
        address: required("CLIENT_ADDRESS", "localhost"),
    },
    
    db: {
        host: required("DB_HOST")
    }
}