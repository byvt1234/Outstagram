import express from "express"
import { isAuth } from "../02_middleware/auth.js"
import * as userController from "../03_controller/users.js"

const router = express.Router()

// 사용자 생성하기 (회원가입) [x]
// api/auth/signup 가 있어서 구현 안함
// router.post("/", userController.createUser)

// 아이디 중복 확인
router.get("/idDuplicated", userController.checkUseridDuplicated)

// 이메일 중복 확인
router.get("/emailDuplicated", userController.checkEmailDuplicated)

// 내 정보 확인
router.get("/me", isAuth, userController.getMyProfile)

// 내 정보 수정
router.patch("/me", isAuth, userController.updateMyProfile)

// 회원 탈퇴 (진짜 삭제)
router.delete("/me", isAuth, userController.deleteMyAccount)

// 내 포스팅 조회
router.get("/me/posts", isAuth, userController.getMyPosts)

// 내 북마크 조회
router.get("/me/bookmarks", isAuth, userController.getMyBookmarks)

export default router
