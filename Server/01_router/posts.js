import express from "express"
import { isAuth } from "../02_middleware/auth.js"
import * as postController from "../03_controller/posts.js"
import * as commentController from "../03_controller/comments.js"
import * as bookmarkController from "../03_controller/bookmarks.js"
import { uploadPostImages, updatePostImages } from "../02_middleware/upload.js"

const router = express.Router()

// 전체 포스트 가져오기 [x]
router.get("/", isAuth, postController.getPosts)

// 글번호에 대한 포스트 가져오기 [x]
router.get("/:id", isAuth, postController.getPost)

// 포스트 쓰기 [x]
router.post("/", isAuth, uploadPostImages, postController.createPost)

// 포스트 수정하기 [x]
router.patch("/:id", isAuth, updatePostImages, postController.updatePost)

// 포스트 삭제하기 [x]
router.delete("/:id", isAuth, postController.deletePost)


// // // // // // [댓글] // // // // // //

// 댓글들 조회
router.get("/:postId/comments", isAuth, commentController.getCommentsByPostId)

// 댓글 생성
router.post("/:postId/comments", isAuth, commentController.createComment)

// // // // // // [북마크] // // // // // //

// 북마크 생성
router.post("/:postId/bookmarks", isAuth, bookmarkController.createBookmark)

// 북마크 삭제
router.delete("/:postId/bookmarks", isAuth, bookmarkController.deleteBookmark)


export default router
