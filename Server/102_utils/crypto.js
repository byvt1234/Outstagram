import crypto from "crypto"
import path from "path"
import {fileCurrTime} from "./time.js";

export function createUUIDFileName({ originalName, userId }) {
  const ext = path.extname(originalName).toLocaleLowerCase()

  return `[${fileCurrTime()}]_[USER_${userId}]_${crypto.randomUUID()}${ext}`
}