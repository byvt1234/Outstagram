import express from "express"
import * as userRepository from "../05_data/users.js"
import * as bcrypt from "bcrypt"
import { config } from "../config.js"
import jwt from "jsonwebtoken"
import {ApiError} from "../102_utils/api/ApiError.js";
import mongoose from "mongoose";

// 회원가입
export async function signup(req, res) {
    const { userid, password, name, email } = req.body

    // 회원 중복 체크
    const found = await userRepository.findByUserid(userid)
    if (found) {
        return res.status(409).json({ message: `${userid}이 이미 있습니다` })
    }
    const hashed = bcrypt.hashSync(password, config.bcrypt.saltRounds)

    // 회원 가입
    const user = await userRepository.createUser({
        userid, passwordHash: hashed, name, email
    })
    const token = await createJwtToken(user._id)
    console.log(token)
    res.status(201).json({ token, user })
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
