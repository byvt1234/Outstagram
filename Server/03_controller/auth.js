import express from "express"
import * as userRepository from "../05_data/users.js"
import * as bcrypt from "bcrypt"
import { config } from "../config.js"
import jwt from "jsonwebtoken"
import {ApiError} from "../102_utils/api/ApiError.js";
import mongoose from "mongoose";
import * as userDuplicated from "./users.js"

// 회원가입
export async function signup(req, res) {
    try {
        // 1. 회원가입 데이터 받기
        const {
            userid,
            password,
            name,
            nickName,
            email
        } = req.body

        // 2. 필수 입력값 확인
        if (!userid || !password || !name || !nickName || !email) {
            return res.status(400).json({
                message: "필수 입력값을 모두 입력해주세요."
            })
        }

        // 3. 입력값 형식 검사
        // 아이디 길이 및 형식 검사 (소문자, 숫자, 4~12자)
        const useridRegex = /^[a-z0-9]{4,12}$/
        if(!useridRegex.test(userid)) {
            return res.status(400).json({
                message: "아이디는 소문자, 숫자, 4~12자이여야 합니다."
            })
        }
        // 비밀번호 길이 및 형식 검사 (영문자 최소 1개, 숫자 최소 1개, 특수문자 최소 1개를 포함하여 총 8자 이상)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        if(!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "비밀번호는 영문자 최소 1개, 숫자 최소 1개, 특수문자 최소 1개를 포함하여 총 8자 이상이여야 합니다."
            })
        }
        // 이메일 형식 검사
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.test(email)) {
            return res.status(400).json({
                message: "이메일 형식을 확인해주세요"
            })
        }

        // 4. 아이디 중복 확인
        const foundUserid = await userRepository.findByUserid(userid)

        if (foundUserid) {
            return res.status(409).json({
                message: "이미 사용 중인 아이디입니다."
            })
        }

        // 5. 이메일 중복 확인
        const foundEmail = await userRepository.findByEmail(email)

        if (foundEmail) {
            return res.status(409).json({
                message: "이미 사용 중인 이메일입니다."
            })
        }

        // 6. 비밀번호 암호화
        const passwordHash = await bcrypt.hash(
            password,
            config.bcrypt.saltRounds
        )

        // 7. 회원 정보 저장
        const createdUser = await userRepository.createUser({
            userid,
            passwordHash,
            name,
            nickName,
            email
        })

        // 8. JWT 생성
        const token = createJwtToken(createdUser._id)

        // 9. 클라이언트에 전달할 사용자 정보 구성
        // passwordHash는 포함하지 않음
        const user = {
            id: createdUser._id,
            userid: createdUser.userid,
            name: createdUser.name,
            nickName: createdUser.nickName,
            email: createdUser.email
        }

        // 10. 회원가입 성공 응답
        return res.status(201).json({
            message: "회원가입이 완료되었습니다.",
            token,
            user
        })
    } catch (error) {
        console.error("회원가입 오류:", error)

        // DB의 unique 설정으로 발생한 중복 오류 처리
        // MongoDB 기준으로 중복 오류는 보통 error.code === 11000
        if (error.code === 11000) {
            return res.status(409).json({
                message: "이미 사용 중인 회원 정보입니다."
            })
        }

        return res.status(500).json({
            message: "회원가입 처리 중 오류가 발생했습니다."
        })
    }
}

// 로그인
export async function login(req, res) {
    const { userid, password } = req.body

    const user = await userRepository.findByUserIdIncludePassword(userid)

    // 아이디 확인
    if (!user) {
        return res.status(401).json({ message: "아이디 또는 비밀번호 확인" })
    }

    // 비밀번호 확인해주기
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
        return res.status(401).json({ message: "아이디 또는 비밀번호 확인" })
    }

    // user._id만 넣어주기
    const token = await createJwtToken(user._id)

    res.status(200).json({
        token,
        user: {
            // _id: user._id,
            id: user.userid,
            // name: user.name,
            // email: user.email,
            // createdAt: user.createdAt,
            // updatedAt: user.updatedAt,
        }
    })

}

// 로그인 유지
export async function me(req, res) {

    if (!mongoose.isValidObjectId(req.id)) {
        throw new ApiError(400, "토큰 형식이 올바르지 않습니다.")
    }

    const user = await userRepository.findById(req.id)
    if(!user){
        return res.status(404).json({ message: "일치하는 사용자가 없음"})
    }
    res.status(200).json({ 
      token: req.token, userid: user.userid
    })
}

// 로그아웃 (구현안함)
// async function logout(req, res) {}

// JWT 토큰 생성
async function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresInSec
    })
}
