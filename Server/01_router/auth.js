import express from "express"
import * as authController from "../03_controller/auth.js"
import { isAuth } from "../02_middleware/auth.js"

const router = express.Router()

// 회원가입 [x]
router.post("/signup", authController.signup)

// 로그인 [x]
router.post("/login", authController.login)

// 로그아웃 (구현 안함)
// router.post("/logout", authController.logout)

// 로그인 유지 체크 및 본인 데이터 확인 [x]
router.get("/me", isAuth, authController.me)

export default router
