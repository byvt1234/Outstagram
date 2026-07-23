import express from "express"
import { isAuth } from "../02_middleware/auth.js"
import * as commentController from "../03_controller/comments.js"

const router = express.Router()

// 댓글 생성은 POST /api/posts/:postId/comment
router.post("posts/:postId/comment",isAuth,commentController.createComment)
// 댓글 조회는 GET /api/posts/:postId/comments
router.get("posts/:postId/comment",isAuth,commentController.getCommentsByPostId)
// 댓글 삭제
router.delete("/:commentId", isAuth, commentController.deleteComment)

export default router
