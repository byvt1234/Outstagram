import express from "express"
import authRouter from "./auth.js"
import usersRouter from "./users.js"
import postsRouter from "./posts.js"
import commentsRouter from "./comments.js"
import bookmarksRouter from "./bookmarks.js"

const router = express.Router()

router.use("/auth", authRouter)

router.use("/users", usersRouter)

router.use("/posts", postsRouter)

router.use("/comments", commentsRouter)

router.use("/bookmarks", bookmarksRouter)

export default router
