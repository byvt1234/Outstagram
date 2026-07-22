import jwt from "jsonwebtoken"
import { config } from "../config.js"
import * as userRepository from "../05_data/users.js"
import mongoose from "mongoose";
import { ApiError } from "../102_utils/api/ApiError.js";

const AUTH_ERROR = { message: "인증에러" }

/**
 * 사용자의 요청에 Authorization: Bearer jwtToken[id: users._id] 가 있는지 확인 후 
 * 
 * 없으면 401
 * 
 * 있으면 
 * 
 * req.id = user._id
 * 
 * req.token = jwtToken
 * 
 * 넣어주기
 */
export const isAuth = async (req, res, next) => {
  
  // 헤더에서 Authorization value 꺼내기
  const authHeader = req.get("Authorization")
  console.log(authHeader)

  // Bearer으로 시작하는지 확인하기
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("헤더에러")
    return res.status(401).json(AUTH_ERROR)
  }

  // 한 값만 꺼내오기
  const token = authHeader.split(" ")[1]
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    // jwt 토큰으로 잘 해석이 되면 id, userid 뽑아서 
    if (error) {
        console.log("토큰에러")
        return res.status(401).json(AUTH_ERROR)
    }
    // console.log(decoded)
    if (!mongoose.isValidObjectId(decoded.id)) {
      return res.status(401).json(AUTH_ERROR)
    }
    const user = await userRepository.findById(decoded.id)
    if(!user) {
        console.log("해당 아이디 없음")
        return res.status(401).json(AUTH_ERROR)
    }
    console.log("user._id: ", user._id)
    console.log("user.userid: ", user.userid)
    req.id = user._id
    req.token = token

    next()
  })
} 
