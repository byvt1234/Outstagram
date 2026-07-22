// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
//                                 Prev Version [X-Server]                             // 
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
// import MongoDB from "mongodb"
// import { config } from "../config.js"

// let db

// export async function connectDB() {
//     return MongoDB.MongoClient.connect(config.db.host).then((client) => {
//         db = client.db("Xdb")
//     })
// }

// // users 컬렉션 객체
// export function getUsers() {
//     return db.collection("users")
// }

// // posts 컬렉션 객체
// export function getPosts() {
//     return db.collection("posts")
// }

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

// Created At 2026-07-21 19:12:12

import mongoose from "mongoose"
import { config } from "../config.js"
import logger from "../102_utils/log.js"

export async function connectDB() {
  try {
    await mongoose.connect(config.db.host)

    logger("101_db/database.js connectDB", "mongoose connected")
  } catch (error) {
    logger("101_db/database.js connectDB", 
      `error: ${error}`)
    process.exit(1)
  }
}